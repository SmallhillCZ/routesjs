---
layout: default
---

# Installation

```sh
npm i @smallhillcz/routesjs
```

# Motivation

As far as I can say there is no NodeJS framework that would support:
 - Automatic named links generation for **discoverable APIs based on defined routes based on availability** (routes automatically appear in root API endpoint and individual documents' _links array depending if they are available)
 - **Permission-based and workflow-based based filtering of routes and links**, i. e. what user can and what is possible for document respecitvely.
 - **Access control based on roles and document properties** allowing for checking against documents (if user has certain permission on a document) and filtering documents based on permission (which documents user has permission on)
 
 If you know about any, please let me know, I will gladly shut this down in a minute :)

# Examples

 - [Usage](#import-the-library)
 - [Routes](#routes)
 - [RoutesLinks](#routes)
 - [RoutesACL](#routes)
   
## Usage

### Import Routes router
```typescript
const { Routes } = require("@smallhillcz/routesjs");
const routes = new Routes();
```

### Making a child router
child.js
```js
const { Routes } = require("@smallhillcz/routesjs");
const routes = new Routes();

// your child routes
routes.get("posts","/").handle(...);
routes.post("posts","/").handle(...);

module.exports = routes;
```

main.js
```js
const { Routes } = require("@smallhillcz/routesjs");
const routes = new Routes();

routes.child("/posts",require("./child");
```

### Binding Routes child to Express router
```js
const router = express.Routes();

router.use("/posts", require("./child").router);
```

### Binding Routes child to Express app
```js
const app = express();

app.use("/posts", require("./child").router);
```

### Using Express router alongside Routes
```js
routes.routes.get(...);
routes.routes.post(...);
routes.routes.use(...);
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
    name: "My awesome API",
    _links: RoutesLinks.root(req)
  });
});
```
or use Express router:
```js
routes.router.get("/", (req,res) => {
  res.json({
    name: "My awesome API",
    _links: RoutesLinks.root(req)
  });
});
```

The output of `GET /` will look like this:
```js
{
  name: "My awesome API",
  _links: {
    "self": { href: "/", allowed: { GET: true } }, 
    "posts:self": { href: "/posts", allowed: { GET: true, POST: true } }, 
    "post:self": { href: "/posts/:post", templated: true, allowed: { GET: true } }, 
    "post:comments": { href: "/posts/:post/comments", templated: true, allowed: { GET: true } }
  }
}
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
  req.routes.links(posts,"post"); // "post" defines which routes will be used, here staring with "post:"
  
  // return posts to client
  res.json(posts);
});
```

The output of `GET /posts` will look like this:
```js
[
 {
  id: 1,
  name: "Post name",
  _links: {
   "self": { href: "/posts/1", allowed: { GET: true, POST: true } }, 
   "comments": { href: "/posts/1/comments", allowed: { GET: true } }
  },
  _actions: {
   "publish": { href: "/posts/1", allowed: true }
  },
  ...
]  
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

#### Define condition or filter based on function of `req`
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

# Contributing

TODO :(
