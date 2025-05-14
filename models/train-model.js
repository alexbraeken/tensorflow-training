const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
const fs = require('fs');

// Sample training data (replace with your dataset)
const trainingData = [
    // Property Search
    { text: "Show me 2BR in SoHo", label: "property_search" },
    { text: "Find a 3-bedroom apartment in downtown", label: "property_search" },
    { text: "Any houses available near the beach?", label: "property_search" },
    { text: "Looking for a studio in Lisbon", label: "property_search" },
    { text: "Browse available villas in Albufeira", label: "property_search" },
    { text: "What properties do you have in Portimão?", label: "property_search" },
    { text: "List available rentals for this weekend", label: "property_search" },
    { text: "Which properties are open next week?", label: "property_search" },
    { text: "Show apartments with a pool", label: "property_search" },
    { text: "Do you have pet-friendly places in Lagos?", label: "property_search" },
  
    // Property Detail Lookup
    { text: "What's the status of #789?", label: "property_detail" },
    { text: "Tell me about Casa Amarela", label: "property_detail" },
    { text: "Get info on unit 110", label: "property_detail" },
    { text: "Is Villa Sunset active or inactive?", label: "property_detail" },
    { text: "Pull listing details for house 234", label: "property_detail" },
    { text: "Show me the profile for property ID 990", label: "property_detail" },
  
    // Owner Lookup
    { text: "Who owns property ID 1045?", label: "owner_lookup" },
    { text: "Tell me the owner of Casa Verde", label: "owner_lookup" },
    { text: "Get owner info for unit 44", label: "owner_lookup" },
    { text: "Who's managing Villa Mar?", label: "owner_lookup" },
    { text: "Find the landlord of apartment 92", label: "owner_lookup" },
    { text: "Who is the contact for house 55?", label: "owner_lookup" },
  
    // Booking Detail
    { text: "When is the next check-in for Casa Azul?", label: "booking_detail" },
    { text: "Who is booked in apartment 7B this weekend?", label: "booking_detail" },
    { text: "Get current reservation details for unit 104", label: "booking_detail" },
    { text: "Has anyone booked villa 23 in July?", label: "booking_detail" },
    { text: "Check the checkout date for apartment 3C", label: "booking_detail" },
    { text: "When does the guest leave house #12?", label: "booking_detail" },
  
    // Booking Availability
    { text: "Is apartment 12A available next weekend?", label: "availability_check" },
    { text: "Can I book villa 90 for June 10-15?", label: "availability_check" },
    { text: "Is Casa Linda free on the 22nd?", label: "availability_check" },
    { text: "Check if unit 45 is open in August", label: "availability_check" },
    { text: "Do you have availability in Faro for Christmas?", label: "availability_check" },
    { text: "Any openings for the villa near the cliffs?", label: "availability_check" },
  
    // Booking Add
    { text: "Add a booking for Casa Nova from June 1 to 7", label: "booking_add" },
    { text: "Book villa 99 for the Smiths on July 3rd", label: "booking_add" },
    { text: "Schedule a reservation at unit 212 from Aug 10-12", label: "booking_add" },
    { text: "Reserve apartment 3B for 2 guests next weekend", label: "booking_add" },
    { text: "Place a booking at the beachfront house from Sept 1 to 5", label: "booking_add" },
    { text: "Create a booking for John Doe in villa 77", label: "booking_add" },
  
    // Booking Cancel
    { text: "Cancel the booking at villa 13", label: "booking_cancel" },
    { text: "Remove reservation for apartment 4A", label: "booking_cancel" },
    { text: "Delete booking on house 88", label: "booking_cancel" },
    { text: "Call off reservation in Casa Rosa", label: "booking_cancel" },
    { text: "Scrap the guest check-in at unit 40", label: "booking_cancel" },
  
    // Task Schedule Cleaning
    { text: "Schedule a full clean at Casa Azul", label: "task_schedule_cleaning" },
    { text: "Book a refresh clean for unit 55 tomorrow", label: "task_schedule_cleaning" },
    { text: "Set up cleaning after checkout at apartment 10", label: "task_schedule_cleaning" },
    { text: "Add deep clean task for villa 21", label: "task_schedule_cleaning" },
    { text: "Plan a post-stay clean for suite 8B", label: "task_schedule_cleaning" },
  
    // Maintenance Request
    { text: "Request a repair for the AC in villa 4", label: "maintenance_request" },
    { text: "Log maintenance for broken lock in unit 33", label: "maintenance_request" },
    { text: "Create a ticket for plumbing in house 61", label: "maintenance_request" },
    { text: "Add maintenance task for electrical issues in apt 23", label: "maintenance_request" },
    { text: "Flag fridge repair needed in villa Sol", label: "maintenance_request" },
  
    // Cleaning Status Update
    { text: "Mark unit 34 as cleaned", label: "task_update_cleaning_status" },
    { text: "Update cleaning status of apartment 9B", label: "task_update_cleaning_status" },
    { text: "Set Casa Verde to clean", label: "task_update_cleaning_status" },
    { text: "Mark villa 11 as not cleaned", label: "task_update_cleaning_status" },
    { text: "Change cleaning status to 'in progress' for unit 8", label: "task_update_cleaning_status" },
  
    // Property Assignment
    { text: "Assign guest manager to villa 101", label: "task_assign_manager" },
    { text: "Set owner for Casa Mar", label: "owner_assign" },
    { text: "Change property manager for unit 76", label: "task_assign_manager" },
    { text: "Reassign owner for house 234", label: "owner_assign" },
  
    // Property Status Update
    { text: "Flag unit 18 as under renovation", label: "property_status_update" },
    { text: "Deactivate apartment 44 temporarily", label: "property_status_update" },
    { text: "Mark villa 67 as offline", label: "property_status_update" },
    { text: "Put house 11 into maintenance mode", label: "property_status_update" },
  
    // Property Update
    { text: "Update amenities for Casa Rosa", label: "property_update" },
    { text: "Add smart lock info to villa 25", label: "property_update" },
    { text: "Edit description for apartment 9A", label: "property_update" },
    { text: "Fix incorrect photos on unit 109", label: "property_update" },
    { text: "Change the name of villa 2 to 'Villa Aurora'", label: "property_update" }
  ];
  
// Define all labels
const allLabels = [...new Set(trainingData.map(d => d.label))];
const labelToIndex = Object.fromEntries(allLabels.map((l, i) => [l, i]));

// One-hot labels
function getLabelTensor(data) {
  const indices = data.map(d => labelToIndex[d.label]);
  return tf.oneHot(tf.tensor1d(indices, 'int32'), allLabels.length);
}

async function run() {
  const modelUSE = await use.load();

  const sentences = trainingData.map(d => d.text);
  const embeddings = await modelUSE.embed(sentences);
  const labelsTensor = getLabelTensor(trainingData);

  const model = tf.sequential();
  model.add(tf.layers.dense({
    inputShape: [512],
    units: 64,
    activation: 'relu'
  }));
  model.add(tf.layers.dropout({ rate: 0.3 }));
  model.add(tf.layers.dense({
    units: allLabels.length,
    activation: 'softmax'
  }));

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  await model.fit(embeddings, labelsTensor, {
    epochs: 30,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch, logs) =>
        console.log(`Epoch ${epoch + 1}: loss=${logs.loss.toFixed(4)}, acc=${logs.acc.toFixed(4)}`)
    }
  });

  await model.save('file://./models/intent-model');
  fs.writeFileSync('./models/label-map.json', JSON.stringify(labelToIndex, null, 2));

  console.log('Model and label map saved.');
}

run();