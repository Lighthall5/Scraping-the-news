const mongoose = require("mongoose");
const Note = require("./Note");

//Schema constructor ref
let Schema = mongoose.Schema;

//Creates new user Schema obj
let ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  //link is required
  link: {
    type: String,
    required: true
  },

  //Stores note id
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
});
ArticleSchema.pre("remove", function(next) {

  Note.remove({ article_id: this._id }).exec();
  next();
});

//Creates model for the schema above using mongoose
let Article = mongoose.model("Article", ArticleSchema);

//Export Article model
module.exports = Article;
