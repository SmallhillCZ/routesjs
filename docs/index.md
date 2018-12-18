---
title: RoutesJS
description: An opinionated layer over ExpressJS
layout: default
---

# Table of Contents
* TOC
{:toc}

# Installation

```sh
npm i @smallhillcz/routesjs
```

# Motivation

As far as I can say there is no NodeJS framework that would support:
 - Automatic named links generation for discoverable APIs based on defined routes (routes automatically appear in root API endpoint and individual documents' _links array)
 - Permission-based (what user can) and workflow-based (what is possible for document) based filtering of routes and links.
 - Access control based on roles and document properties allowing for checking against documents (if user has certain permission on a document) and filtering documents based on permission (which documents user has permission on)
 
 If you know about any, please let me know, I will gladly shut this down in a minute :)

# Examples


## Import the routes library
```typescript
const { Routes } = require("@smallhillcz/routesjs");
const routes = new Routes();
```

## Routes

### Simplest route definition

```javascript
routes.get("posts","/posts");
```

Provide name of the route and url.

### Handle the route with Express middleware
```javascript
routes.get("posts","/posts").handle( async (req,res,next) => {
  const posts = await Post.find();
  res.json(posts);
});
```

Each event will be appended with parameters `_links` and `_actions` containing links starting with `event:` and allowed for current user and current state of document 

### Limit route to be listed only under certain docs
```js
routes.post("post:publish", "/posts/:post/publish", { query: { status: "draft" } }).handle(async (req,res) => {
  await Post.findOneAndUpdate({ id:req.params.event }, { status: "public" });
  res.sendStatus(200);
});
```

## RoutesLinks

### Create root API endpoint

Either use routes way including permission to read api:
```js
routes.get(null, "/", { permission: "api:read" }).handle((req,res) => {
  res.json({
    _links: RoutesLinks.root(req)
  });
});
```
or use Express router:
```js
routes.router.get("/", (req,res) => {
  res.json({
    _links: RoutesLinks.root(req)
  });
});
```

### Add the route to `_links` and `_actions` of documents
```javascript

// define some routes to be added
routes.get("post","/posts/:post");
routes.patch("post","/posts/:post");
routes.get("post:comments","/posts/:post/comments");
routes.action("post:publish","/posts/:post/publish")

// route to list posts
routes.get("posts","/posts").handle( async (req,res,next) => {
  
  // get posts
  const posts = await Post.find().lean(); // mongoose objects cannot be modified, therefore .lean()
  
  // append links
  req.routes.links(posts,"post");
  
  // return posts to client
  res.json(posts);
});
```


## RoutesACL

### Define user roles and permissions
#### Define simple allow
```js

const permissions = {
  "posts:list": { admin: true, editor: true, guest: true },
  "posts:edit": { admin: true, editor: true }
};
```
TIP! Use preset vars for better readability:
```js
const admin = true, editor = true, guest = true;

const permissions = {
    "posts:list": { admin, editor, guest },  
    "posts:list": { admin, editor }
  }
};
```
#### Define filter allow - as a route guard works same as `true`, for `_links` and RoutesPluginsMongoose also filters documents
```js
const permissions = {
  ...
  "posts:publish": { admin: true, editor: true, assistantEditor: { postType: "unimportant" } }
  ...
};
```

#### Define condition or filter based on function(req)
```js
const permissions = {
  ...
  "posts:edit": { admin: true, author: req => ({ author: req.user.id }) }
  ...
};
```

### Set up RoutesACL
```js
Routes.setACL({
  // permissions from previous part
  permissions: require("./permissions"),
  // function to get user roles from req
  userRoles: req => req.user ? req.user.roles || [] : [],
  // user role assigned to every request
  defaultRole: "guest",
  
  // log route access to console
  logConsole: true,
  // how the log should look like
  logString: event => `ACL ${event.result ? "OK" : "XX"} | permission: ${event.permission}, user: ${event.req.user ? event.req.user._id : "-"}, roles: ${event.req.user ? event.req.user.roles.join(",") : "-"}, ip: ${event.req.headers['x-forwarded-for'] || event.req.connection.remoteAddress}`
});
```

### Limit route to users with certain permission (also limits route allowed indicator in `_links`)
```js
routes.post("events", "/events", { permission: "events:list" }).handle(async (req,res) => {
  const events = await Event.find();
  res.json(events);
});
```

## RoutesPluginsMongoose

### Plug the plugin to Mongoose

```js
const { RoutesPluginsMongoose } = require("@smallhillcz/routesjs/lib/plugins/mongoose");

mongoose.plugin(RoutesPluginsMongoose);
```

### Filter mongoose docs according to permissions

```javascript
routes.get("my-events","/my/events").handle( async (req,res,next) => {
  
  const events = await Event.find().filterByPermission("my-events:list", req); // filter only my events
  
  res.json(events);
});
```

# Known limits

### It is not possible to guard against doc, instead returns 404

In the following code the constant `events` is going to be `null` as if event was not found. It is not possible to distinguish non existent document from the case when document would be found but is not accessible due to permissions.

```javascript
routes.get("my-event","/my/events/:event").handle( async (req,res,next) => {
  
  // get event from database
  const event = await Event.findOne().filterByPermission("my-events:read", req); // filter only my events
  
  // event not found
  if(!event) return res.sendStatus(404);
  
  // reurn event
  res.json(event);
});
```


