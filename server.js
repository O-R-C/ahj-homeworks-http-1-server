// const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const Router = require('@koa/router')
const cors = require('@koa/cors')
const koaStatic = require('koa-static')
const { koaBody } = require('koa-body')
const Tickets = require('./src/js/Tickets')
const fakeData = require('./src/js/fakeData')
console.log('🚀 ~ fakeData:', fakeData)

const tickets = new Tickets(fakeData)
console.log('🚀 ~ tickets:', tickets.tickets)

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

router.get('/', (ctx) => {
  ctx.body = JSON.stringify(tickets.tickets)
})

router.post('/test', (ctx) => {
  ctx.body = JSON.stringify(tickets.tickets)
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)
