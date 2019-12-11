const mongoose = require('mongoose')
const SChema = mongoose.Schema

const ProfileSchema = new SChema({
    type:{
        type:String
    },
    describe:{
        type:String
    },
    title:{
        type:String,
        require:true
    },
    income:{
        type:String,
        require:true
    },
    expend:{
        type:String,
        require:true
    },
    cash:{
        type:String,
        require:true
    },
    remark:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
})


module.exports = Profile = mongoose.model("profile",ProfileSchema);
