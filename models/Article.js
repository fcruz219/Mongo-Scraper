var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
          },
      // `link` is required and of type String
      link: {
        type: String,
        required: true
      },
      summary: {
        type: String,
        required: true,
      },

      isSaved: {
        type: Boolean,
        default: false,
        required: false,
        unique: false
      },
      note: {
        type: Schema.Types.ObjectId,
        ref: 'Note'
      }
})

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
