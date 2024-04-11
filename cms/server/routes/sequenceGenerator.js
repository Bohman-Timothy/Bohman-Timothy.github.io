//Modifications in file (including all comments below) shared by Aaron Picker on the W11 Developer Forum

const sequenceGenerator = {   //First, I restructured sequenceGenerator to be a variable containing the various methods.
  async init() {    //Make this init() function asynchronous
       try {
            const sequence = await Sequence.findOne({}).exec();   //"exec()" here has to do with Mongoose and async functions. Not sure if it's entirely necessary, but it works with it in there. 
            if (!sequence) {
                  throw new Error('Sequence not found');
            }
            this.sequenceId = sequence._id;
            this.maxDocumentId = sequence.maxDocumentId;
            this.maxMessageId = sequence.maxMessageId;
            this.maxContactId = sequence.maxContactId;
       } catch (err) {
            console.error('Error initializing SequenceGenerator:', err);
            throw err;
       }
},

async nextId(collectionType) {
     // Ensure the generator is initialized. If not, call the init() function above. 
     if (!this.sequenceId) {
          await this.init();
        }

  switch (collectionType) {
    case 'documents':
      maxDocumentId++;
      updateObject = {maxDocumentId: maxDocumentId};
      nextId = maxDocumentId;
      break;
    case 'messages':
      maxMessageId++;
      updateObject = {maxMessageId: maxMessageId};
      nextId = maxMessageId;
      break;
    case 'contacts':
      maxContactId++;
      updateObject = {maxContactId: maxContactId};
      nextId = maxContactId;
      break;
    default:
      return -1;
  }

  Sequence.update({_id: sequenceId}, {$set: updateObject},
    function(err) {
      if (err) {
        console.log("nextId error = " + err);
        return null
      }
    });

  return nextId;
}

//Add other functions as needed.

};    //Close out the sequenceGenerator object.

module.exports = sequenceGenerator;


// ----------------------------------------------------------
// Original code provided

// var Sequence = require('../models/sequence');

// var maxDocumentId;
// var maxMessageId;
// var maxContactId;
// var sequenceId = null;

// function SequenceGenerator() {

//   Sequence.findOne()
//     .exec(function(err, sequence) {
//       if (err) {
//         return res.status(500).json({
//           title: 'An error occurred',
//           error: err
//         });
//       }

//       sequenceId = sequence._id;
//       maxDocumentId = sequence.maxDocumentId;
//       maxMessageId = sequence.maxMessageId;
//       maxContactId = sequence.maxContactId;
//     });
// }

// SequenceGenerator.prototype.nextId = function(collectionType) {

//   var updateObject = {};
//   var nextId;

//   switch (collectionType) {
//     case 'documents':
//       maxDocumentId++;
//       updateObject = {maxDocumentId: maxDocumentId};
//       nextId = maxDocumentId;
//       break;
//     case 'messages':
//       maxMessageId++;
//       updateObject = {maxMessageId: maxMessageId};
//       nextId = maxMessageId;
//       break;
//     case 'contacts':
//       maxContactId++;
//       updateObject = {maxContactId: maxContactId};
//       nextId = maxContactId;
//       break;
//     default:
//       return -1;
//   }

//   Sequence.update({_id: sequenceId}, {$set: updateObject},
//     function(err) {
//       if (err) {
//         console.log("nextId error = " + err);
//         return null
//       }
//     });

//   return nextId;
// }

// module.exports = new SequenceGenerator();
