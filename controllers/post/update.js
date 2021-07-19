const mongoose = require("mongoose");
const { posts } = require("../../mongodb/models");
const { isAuthorized } = require("../tokenHandle");
const { findAndModifyConfig } = require("../../config");
const deleteObject = require("../s3/deleteObject");

module.exports = async (req, res) => {
  try{
    const { post_id } = req.params;
    const tokenBodyData = isAuthorized(req);
    if(!tokenBodyData){
      return res.status(401).send({
        data: null,
        message: "Authorization dont exist"
      });
    };
    
    await posts.findOne({ _id: post_id })
    .then((result) => {
      const difference = result.media.filter((privData) => {
        return !req.body.media.some((newData) => newData.path===privData.path)
      });
      if(difference[0]) deleteObject(difference);
    })

    await posts.findOneAndUpdate({ _id: post_id }, req.body, findAndModifyConfig)
    .then((result) => {
      res.status(200).send({
        data: {
          post: result
        },
        message: "ok"
      });
    });

  }catch(err){
    res.status(500).send({
      data: null,
      message: "Server Error"
    });
  };
};