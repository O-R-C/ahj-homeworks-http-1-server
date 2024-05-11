// const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const Router = require('@koa/router')
const Tickets = require('./src/js/Tickets')
const cors = require('@koa/cors')
const koaStatic = require('koa-static')
const { koaBody } = require('koa-body')
const fakeData = require('./src/js/fakeData')

const app = new Koa()
const router = new Router()
const tickets = new Tickets(fakeData)

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT', 'DELETE'],
  }),
)
app.use(koaStatic(path.join(__dirname, 'public')))
app.use(koaBody({ json: true, text: true, urlencoded: true, multipart: true }))

router.get('/tickets', tickets.getTickets)

router.get('/tickets/:id', tickets.getDescription)

router.post('/tickets', tickets.createTicket)

router.patch('/tickets/:id', tickets.updateTicket)

router.delete('/tickets/:id', tickets.deleteTicket)

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)
