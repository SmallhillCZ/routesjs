---
title: RoutesJS
description: An opinionated layer over ExpressJS
layout: default
---

# RoutesJS

## Simple route example

### Import the routes library and create new router
```javascript
const { Routes } = require("@smallhillcz/routesjs");
const routes = new Routes();
```

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

## Advanced route settings

### Limit route to be listed only under certain docs

routes.get("event:publish", "/events/:event/publish", { query: { status: "draft" } }).handle(async (req,res) => {
  await Event.findOneAndUpdate({ id:req.params.event }, { status: "public" });
  res.sendStatus(200);
});

## Create root API endpoint

### Either use routes way including permission to read api
```js
routes.get(null, "/", { permission: "api:read" }).handle((req,res) => {
  res.json({
    _links: RoutesLinks.root(req)
  });
});
```
