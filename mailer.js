var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'travisbergeron2011@gmail.com',
        pass : 'Myb34risn4m3dT3ddy9'
    }
});

transporter.sendMail({
    from : 'travisbergeron20@fgschools.com',
    to : 'travisbergeron2011@gmail.com',
    subject : 'Testing nodemailer',
    text : 'It works!'
},function(err, info) {
    if(err) throw err;
    console.log("Email sent " + info.response);
});