const Restaurant = require("../../models/Restaurant");
const User = require("../../models/User");

const createRestaurant = async (req, res) => {
    try {
        const { name, location, seatCapacity, owner, seating_plan } = req.body;

        if (!name || !location || !seatCapacity || !owner || !seating_plan) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const user = await User.findById(owner);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.accountType !== "Restaurant") {
            return res.status(400).json({ message: "User is not a restaurant owner" });
        }

        const existingRestaurant = await Restaurant.findOne({ owner });
        if (existingRestaurant) {
            return res.status(400).json({ message: "Restaurant already exists" });
        }

        const restaurant = new Restaurant({
            name,
            location,
            seatCapacity,
            owner,
            seating_plan,
        });

        await restaurant.save();
        return res.status(201).json({ message: "Restaurant created successfully", restaurant });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error while creating restaurant", error });
    }
};

// Get all restaurants of a user
const getRestaurants = async (req, res) => {
    try {
        const { owner } = req.params;

        const user = await User.findById(owner);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.accountType !== "Restaurant") {
            return res.status(400).json({ message: "User is not a restaurant owner" });
        }

        const restaurants = await Restaurant.find({ owner });
        if (restaurants.length === 0) {
            return res.status(404).json({ message: "No restaurants found for this owner" });
        }

        return res.status(200).json({ restaurants });
    } catch (error) {
        return res.status(500).json({ message: "Error while fetching restaurants", error });
    }
};

// Add a section to the seating plan
const addSection = async (req, res) => {
    try {
        const { owner, section_name } = req.body;

        if (!owner || !section_name) {
            return res.status(400).json({ message: "Owner and section name are required" });
        }

        const user = await User.findById(owner);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.accountType !== "Restaurant") {
            return res.status(400).json({ message: "User is not a restaurant owner" });
        }

        const restaurant = await Restaurant.findOne({ owner });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const sectionExists = restaurant.seating_plan.sections.some(
            (section) => section.section_name === section_name
        );

        if (sectionExists) {
            return res.status(400).json({ message: "Section already exists" });
        }

        const section = {
            section_name,
            rows: [],
        };

        restaurant.seating_plan.sections.push(section);

        await restaurant.save();
        return res.status(201).json({ message: "Section added successfully", restaurant });
    } catch (error) {
        return res.status(500).json({ message: "Error while adding section", error });
    }
};

// add a row
const addRow = async (req, res) => {
    try {
        const {row_id, restaurant_id,section_name,owner} = req.body;

        const user = await User.findById(owner);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.accountType !== "Restaurant") {
            return res.status(400).json({ message: "User is not a restaurant owner" });
        }   

        const restaurant = await Restaurant.findOne({ _id: restaurant_id });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const section = restaurant.seating_plan.sections.find(
            (section) => section.section_name === section_name
        );  

        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }

        const rowExists = section.rows.some((row) => row.row_id === row_id);
        if (rowExists) {
            return res.status(400).json({ message: "Row already exists" });
        }

        const row = {
            row_id,
            seats: [],
        };

        section.rows.push(row);

        await restaurant.save();
        return res.status(201).json({ message: "Row added successfully", restaurant });


    } catch (error) {
           return res.status(500).json({ message: "Error while adding row", error });  
    }
}

// add a seat
const addSeat = async (req, res) => {
    try {
        const { row_id, restaurant_id, section_name, seat, owner } = req.body;

        const user = await User.findById(owner);    

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.accountType !== "Restaurant") {
            return res.status(400).json({ message: "User is not a restaurant owner" });
        }   

        const restaurant = await Restaurant.findOne({ _id: restaurant_id });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const section = restaurant.seating_plan.sections.find(
            (section) => section.section_name === section_name
        );

        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }

        const row = section.rows.find((row) => row.row_id === row_id);

        if (!row) {

            return res.status(404).json({ message: "Row not found" });
        }

        const seatExists = row.seats.some((seat) => seat.seat_id === seat.seat_id);
        if (seatExists) {
            return res.status(400).json({ message: "Seat already exists" });
        }

        row.seats.push(seat);

        await restaurant.save();
        return res.status(201).json({ message: "Seat added successfully", restaurant });
    }
    catch (error) {
        return res.status(500).json({ message: "Error while adding seat", error });
    }
}


// Update the restaurant
const updateRestaurant = async (req, res) => {
    try {
        const { restaurant_id } = req.params;
        const { name, location, seatCapacity, owner, seating_plan } = req.body;

        const restaurant = await Restaurant.findById({ _id: restaurant_id });

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const user= await User.findById(owner);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.accountType !== "Restaurant") {
            return res.status(400).json({ message: "User is not a restaurant owner" });
        }

        if(name)
        restaurant.name = name;

        if(location)
        restaurant.location = location

        if(seatCapacity)
        restaurant.seatCapacity = seatCapacity;

        if(owner)
        restaurant.owner = owner;

        if(seating_plan)
        restaurant.seating_plan = seating_plan;

        await restaurant.save();

        return res.status(200).json({ message: "Restaurant updated successfully", restaurant });

    } catch (error) {
        return res.status(500).json({ message: "Error while updating restaurant", error }); 
    }
}


const deleteSeat = async (req,res)=>{
    try {
        const { restaurant_id, section_name, row_id, seat_id, owner } = req.body;
        const user = await User.findById(owner);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.accountType !== "Restaurant") {
            return res.status(400).json({ message: "User is not a restaurant owner" });
        }

        const restaurant = await Restaurant.findOne({ _id: restaurant_id });

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const section = restaurant.seating_plan.sections.find(
            (section) => section.section_name === section_name
        );

        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }

        const row = section.rows.find((row) => row.row_id === row_id);

        if (!row) {
            return res.status(404).json({ message: "Row not found" });
        }

        const seatIndex = row.seats.findIndex((seat) => seat.seat_id === seat_id);

        if (seatIndex === -1) {
            return res.status(404).json({ message: "Seat not found" });
        }

        row.seats.splice(seatIndex, 1);
        await restaurant.save();

        return res.status(200).json({ message: "Seat deleted successfully", restaurant });
    } catch (error) {
        return res.status(500).json({ message: "Error while deleting seat", error });   
    }
}


// delete a row

const deleteRow = async (req, res) => {
    try {
        const { restaurant_id, section_name, row_id, owner } = req.body;
        const user = await User.findById(owner);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.accountType !== "Restaurant") {
            return res.status(400).json({ message: "User is not a restaurant owner" });
        }

        const restaurant = await Restaurant.findOne({ _id: restaurant_id });    

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const section = restaurant.seating_plan.sections.find(
            (section) => section.section_name === section_name
        );

        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }

        const rowIndex = section.rows.findIndex((row) => row.row_id === row_id);

        if (rowIndex === -1) {
            return res.status(404).json({ message: "Row not found" });
        }

        section.rows.splice(rowIndex, 1);

        await restaurant.save();

        return res.status(200).json({ message: "Row deleted successfully", restaurant });

    } catch (error) {

        return res.status(500).json({ message: "Error while deleting row", error });
    }
}

// delete a section

const deleteSection = async (req, res) => {
    try {
        
        const { restaurant_id, section_name, owner } = req.body;

        const user = await User.findById(owner);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.accountType !== "Restaurant") {
            return res.status(400).json({ message: "User is not a restaurant owner" });
        }

        const restaurant = await Restaurant.findOne({ _id: restaurant_id });

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const sectionIndex = restaurant.seating_plan.sections.findIndex(
            (section) => section.section_name === section_name
        );

        if (sectionIndex === -1) {
            return res.status(404).json({ message: "Section not found" });
        }

        restaurant.seating_plan.sections.splice(sectionIndex, 1);

        await restaurant.save();

    } catch (error) {
        return res.status(500).json({ message: "Error while deleting section", error });        
    }
}

// delete the restaurant
const deleteRestaurant = async (req, res) => {
    try {
        const { restaurant_id ,owner} = req.params;

        const user= await User.findById(owner);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.accountType !== "Restaurant") {
            return res.status(400).json({ message: "User is not a restaurant owner" });
        }
        
        const restaurant = await Restaurant.findById({ _id: restaurant_id });

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        await restaurant.remove();

        return res.status(200).json({ message: "Restaurant deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Error while deleting restaurant", error });
    }
}



module.exports = { createRestaurant, getRestaurants, addSection, addRow, addSeat, updateRestaurant, deleteSeat, deleteRow, deleteSection, deleteRestaurant };


