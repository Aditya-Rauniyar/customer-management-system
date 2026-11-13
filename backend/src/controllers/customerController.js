const Customer = require("../models/Customer");
const mongoose = require("mongoose");

// creating a customer
const createCustomer = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Customer name is required"
            });
        }

        const customer = await Customer.create({
            name,
            email,
            phone,
            address,
            userId: req.userId
        });

        return res.status(201).json({
            message: "Customer created successfully",
            customer
        });

    } catch (error) {
        console.error("Create customer error:", error);

        return res.status(500).json({
            message: "Server error while creating customer"
        });
    }
};

// getting all customers for the logged-in user with optional search functionality
const getCustomers = async (req, res) => {
    try {
        const search = req.query.search?.trim();

        // Only fetch customers belonging to logged-in user
        const filter = {
            userId: req.userId
        };

        // Apply search if search query is provided
        if (search) {
            const searchRegex = new RegExp(
                search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                "i"
            );

            filter.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { phone: searchRegex },
                { address: searchRegex }
            ];
        }

        // Fetch customers from database
        const customers = await Customer.find(filter)
            .sort({ createdAt: -1 });

        // If no customers are found
        if (customers.length === 0) {
            return res.status(200).json({
                message: search
                    ? `No customers found matching "${search}"`
                    : "No customers found",
                count: 0,
                customers: []
            });
        }

        // Return customers
        return res.status(200).json({
            message: "Customers fetched successfully",
            count: customers.length,
            customers
        });

    } catch (error) {
        console.error("Get customers error:", error);

        return res.status(500).json({
            message: "Server error while fetching customers"
        });
    }
};

// get a single customer by id
const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validating mongoo object id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid customer ID"
            });
        }

        const customer = await Customer.findOne({
            _id: id,
            userId: req.userId
        });

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        return res.status(200).json({
            customer
        });

    } catch (error) {
        console.error("Get customer error:", error);

        return res.status(500).json({
            message: "Server error while fetching customer"
        });
    }
};

// updating a customer
const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;

        // validate customer ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid customer ID"
            });
        }

        // Validate input
        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                message: "Customer name is required"
            });
        }

        if (
            [email, phone, address].some(
                value => value !== undefined && typeof value !== "string"
            )
        ) {
            return res.status(400).json({
                message: "Invalid customer details"
            });
        }

        // Update only the logged-in user's customer shared access not allowing to update other user's customer
        const customer = await Customer.findOneAndUpdate(
            {
                _id: id,
                userId: req.userId
            },
            {
                name: name.trim(),
                email: email?.trim() || "",
                phone: phone?.trim() || "",
                address: address?.trim() || ""
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        return res.status(200).json({
            message: "Customer updated successfully",
            customer
        });

    } catch (error) {
        console.error("Update customer error:", error);

        return res.status(500).json({
            message: "Server error while updating customer"
        });
    }
};

// Delete customer
const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid customer ID"
            });
        }

        const customer = await Customer.findOneAndDelete({
            _id: id,
            userId: req.userId
        });

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        return res.status(200).json({
            message: "Customer deleted successfully"
        });

    } catch (error) {
        console.error("Delete customer error:", error);

        return res.status(500).json({
            message: "Server error while deleting customer"
        });
    }
};



module.exports = { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer };