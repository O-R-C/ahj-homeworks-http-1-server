const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')
const cors = require('@koa/cors')
const koaStatic = require('koa-static')

const app = new Koa()
const router = new Router()

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT', 'DELETE'],
  }),
)
app.use(koaStatic(path.join(__dirname, 'public')))
app.use(koaBody({ json: true, text: true, urlencoded: true }))

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)
