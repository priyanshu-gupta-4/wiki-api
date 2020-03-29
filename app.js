//jshint esversion:6
const ejs=require("ejs");
const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
app.use(express.static("public"));
app.use(bodyParser.urlencoded(
  {
    extended:true
  }
));
app.set('view engine','ejs');
mongoose.connect("mongodb://localhost:27017/wikidb",{useUnifiedTopology:true,useNewUrlParser:true});
const collectionSchema={
  title:String,
  content:String
};
const Articles=mongoose.model("articles",collectionSchema);
app.route("/articles").get(function(req,res){
  Articles.find(function(err,foundArticles){
    if(!err){
        res.send(foundArticles);
    }
  if(err){
    res.send(err);
  }
  });
})
.post(function(req,res){
    jack=new Articles({
    title:req.body.title,
    content:req.body.content
  });
  jack.save(function(err){
    if(!err){
      res.send("success");
    }
    else{
      res.send(err);
    }
  });
})
.put(function(req,res){
  Articles.update({title:req.params.requestedTitle},{overwrite:true});
})
.delete(function(req,res){
  Articles.deleteMany(function(err){
    if(!err){
      res.send("deleted all items successful");
    }
  });
});

app.route("/articles/:requestedTitle")
.get(function(req,res){
  Articles.findOne({title:req.params.requestedTitle},
    {
      title:req.body.title,
      content:req.body.content
    },
    function(err,foundArticle){
          res.send(foundArticle);
  if(err){
    res.send(err);
  }
  });
})
.put(function(req,res){
 Articles.update(
   {title:req.params.requestedTitle},
   {
     title:req.body.title,
     content:req.body.content
   },
   {overwrite:true},
   function(err){
     if(!err){
       res.send("success");
     }else{
       res.send(err);
     }
   });
})
.patch(function(req,res){
  Articles.update(
    {title:req.params.requestedTitle},
    {$set:req.body},
    function(err){
      if(!err){
        res.send("updated data");
      }
  });
})
.delete(function(req,res){
  Articles.deleteOne({title:req.params.requestedTitle},function(err){
    if(!err){
      res.send("deleted this item successful");
    }
  });
});
app.listen(3000,function(){
  console.log("server live on 3000");
});
