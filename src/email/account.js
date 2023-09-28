// const nodemailer=require('nodemailer')

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
const welcome = async (email, name) => {
  // send mail with defined transport object
  try {
    await transporter.sendMail({
      from: '"Task-Manager-App" <kevit.dev.bhayani@gamil.com>', // sender address
      to: email, // list of receivers
      subject: "welcome ✔", // Subject line
      text: "Welcome to Task-Manager-app.Thank you for sign up " + name, // plain text body
      // html: "<b>Hello world?</b>", // html body
    });
  } catch (error) {}

  // console.log("Message sent: %s", messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
};

const cancel = async (email, name) => {

  try {
    await transporter.sendMail({
      from: "Task-Manager-app <kevit.dev.bhayani@gmail.com>",
      to: email,
      subject: "About cancelation",
      text: "why did you canceled",
    });
  } catch (error) {
    
  }
 
};

// welcome().catch(console.error);

module.exports = {
  welcome,
  cancel,
};
