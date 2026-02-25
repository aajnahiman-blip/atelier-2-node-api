const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const config = require('../config.json')
const {success,error} = require('../functions')
const cors = require('cors')

const app = express()
app.use(cors())

// ===== Middleware =====
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))





// ===== Data =====
let members = [
  { id: 1, name: 'PHP' },
  { id: 2, name: 'JavaScript' },
  { id: 3, name: 'Java' }
]
// ===== Router =====Router كيخلينا ننظمو routes.
let MembersRouter = express.Router()
// ===== GET ALL =====
MembersRouter.route('/')
.get((req, res) => {
  res.json(success(members))
})
// ===== POST =====
.post((req, res) => {
 if (req.body.name) {
 let sameName = false
 for (let i = 0; i < members.length; i++) {
 if (members[i].name == req.body.name) {
 sameName = true
 break
 }
 }
 if (sameName) {
 res.json(error('name already taken'))
 } else {
 let member = {
 id: createID(),
 name: req.body.name
 }
 members.push(member)
 res.json(success(member))
 }
 } else {
 res.json(error('no name value'))
 }
 }) 

// ===== GET BY ID =====
MembersRouter.route('/:id')

.get((req, res) => {
 let index = getIndex(req.params.id);
 if (typeof(index) == 'string') {
 res.json(error(index))
 } else {
 res.json(success(members[index]))
 }
 }) 

// ===== PUT =====
.put((req, res) => {
 let index = getIndex(req.params.id);
 if (typeof(index) == 'string') {
 res.json(error(index))
 } else {
 let same = false
 for (let i = 0; i < members.length; i++) {
 if (req.body.name == members[i].name && req.params.id != members[i].id) {
 same = true
 break
 }
 }
 if (same) {
 res.json(error('same name'))
 } else {
 members[index].name = req.body.name
 res.json(success(true))
 }
 }
 }) 


// ===== DELETE =====
.delete((req, res) => {

  let index = getIndex(req.params.id)

  if (typeof index === 'string') {
    return res.json(error(index))
  }

  members.splice(index, 1)
  res.json(success(members))
})

// ===== Functions =====
function getIndex(id) {
 for (let i = 0; i < members.length; i++) {
 if (members[i].id == id)
 return i
 }
 return 'wrong id'
}
function createID() {
 return members[members.length-1].id + 1
}

// ===== Use Router =====
app.use(config.rootAPI + 'members', MembersRouter)

// ===== Start Server =====
app.listen(config.port, () => {
  console.log('Started on port ' + config.port)
})


// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
// }))