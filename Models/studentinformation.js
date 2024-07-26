const { Schema } = require('mongoose')
const { model } = require('mongoose')
const demo = new Schema({
    studentID: { type: Number, required: true },
    studentName: { type: String, required: true },
    studentCourse: { type: String, required: true },
    Date: { type: String, required: true },
    Grade: { type: String, required: true }
   
})

const studentinformation  = model('studentinformation', demo) 
module.exports = studentinformation    