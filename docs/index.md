---
title: RoutesJS
description: An opinionated layer over ExpressJS
layout: default
---

# RoutesJS


## Import the routes library
```javascript
const { Routes } = require("@smallhillcz/routesjs");
const routes = new Routes();
```

## Simple route example

### Simplest route definition

```javascript
routes.get("events","/events");
```

### Handle the route with Express middleware
```javascript
routes.get("events","/events").handle( async (req,res,next) => {
  const events = await Event.find();
  res.json(events);
});
```

### Add the route to `_links` and `_actions` of documents
```javascript

// define some routes to be added
routes.get("event","/events/:event");
routes.patch("event","/events/:event");
routes.get("event:attendees","/events/:event/attendees");
routes.action("event:publish","/events/:event/publish")

// route to list events
routes.get("events","/events").handle( async (req,res,next) => {
  
  // get events
  const events = await Event.find().lean(); // mongoose objects cannot be modified, therefore .lean()
  
  // append links
  req.routes.links(events,"event");
  
  // return events to client
  res.json(events);
});
```

Each event will be appended with parameters `_links` and `_actions` containing links starting with `event:` and allowed for current user and current state of document 

## Advanced route settings

### Limit route to be listed only under certain docs
```js
routes.post("event:publish", "/events/:event/publish", { query: { status: "draft" } }).handle(async (req,res) => {
  await Event.findOneAndUpdate({ id:req.params.event }, { status: "public" });
  res.sendStatus(200);
});
```

## Create root API endpoint

### Either use routes way including permission to read api
```js
routes.get(null, "/", { permission: "api:read" }).handle((req,res) => {
  res.json({
    _links: RoutesLinks.root(req)
  });
});
```
