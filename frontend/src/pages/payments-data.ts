import { type Payment } from "./columns";

// Sample payment data - November 2025 (today is Nov 15, 2025)
export const paymentsData: Payment[] = [
  // Food category
  { id: "1", amount: 100.0, status: "pending", description: "Grocery Store", date: "2025-11-15", category: "Food" },
  { id: "4", amount: 75.25, status: "failed", description: "Coffee Shop", date: "2025-11-12", category: "Food" },
  { id: "8", amount: 125.0, status: "success", description: "Restaurant", date: "2025-11-08", category: "Food" },
  { id: "11", amount: 85.50, status: "success", description: "Supermarket", date: "2025-11-14", category: "Food" },
  { id: "12", amount: 45.75, status: "success", description: "Fast Food", date: "2025-11-13", category: "Food" },
  { id: "13", amount: 120.00, status: "processing", description: "Restaurant Dinner", date: "2025-11-15", category: "Food" },
  { id: "14", amount: 95.25, status: "success", description: "Grocery Shopping", date: "2025-11-11", category: "Food" },
  { id: "15", amount: 65.50, status: "success", description: "Cafe", date: "2025-11-10", category: "Food" },
  { id: "16", amount: 180.00, status: "success", description: "Fine Dining", date: "2025-11-09", category: "Food" },
  { id: "17", amount: 55.75, status: "pending", description: "Bakery", date: "2025-11-07", category: "Food" },
  
  // Utilities category
  { id: "2", amount: 250.5, status: "processing", description: "Electricity Bill", date: "2025-11-11", category: "Utilities" },
  { id: "18", amount: 85.00, status: "success", description: "Water Bill", date: "2025-11-14", category: "Utilities" },
  { id: "19", amount: 120.50, status: "success", description: "Internet Bill", date: "2025-11-13", category: "Utilities" },
  { id: "20", amount: 45.25, status: "success", description: "Phone Bill", date: "2025-11-12", category: "Utilities" },
  { id: "21", amount: 95.75, status: "processing", description: "Gas Bill", date: "2025-11-10", category: "Utilities" },
  
  // Income category
  { id: "3", amount: 500.0, status: "success", description: "Salary Deposit", date: "2025-11-10", category: "Income" },
  { id: "10", amount: 675.0, status: "success", description: "Freelance Payment", date: "2025-11-05", category: "Income" },
  { id: "22", amount: 4200.00, status: "success", description: "Monthly Salary", date: "2025-11-01", category: "Income" },
  { id: "23", amount: 350.00, status: "success", description: "Side Project", date: "2025-11-14", category: "Income" },
  { id: "24", amount: 200.00, status: "pending", description: "Consulting Fee", date: "2025-11-15", category: "Income" },
  { id: "25", amount: 150.00, status: "success", description: "Bonus", date: "2025-11-12", category: "Income" },
  
  // Housing category
  { id: "5", amount: 1200.0, status: "success", description: "Rent Payment", date: "2025-11-05", category: "Housing" },
  { id: "26", amount: 150.00, status: "success", description: "Home Insurance", date: "2025-11-04", category: "Housing" },
  { id: "27", amount: 85.50, status: "success", description: "Maintenance", date: "2025-11-03", category: "Housing" },
  { id: "28", amount: 200.00, status: "processing", description: "Property Tax", date: "2025-11-02", category: "Housing" },
  
  // Transportation category
  { id: "6", amount: 350.75, status: "pending", description: "Gas Station", date: "2025-11-15", category: "Transportation" },
  { id: "29", amount: 45.00, status: "success", description: "Uber Ride", date: "2025-11-14", category: "Transportation" },
  { id: "30", amount: 120.00, status: "success", description: "Public Transport Pass", date: "2025-11-13", category: "Transportation" },
  { id: "31", amount: 280.50, status: "success", description: "Car Insurance", date: "2025-11-12", category: "Transportation" },
  { id: "32", amount: 65.75, status: "success", description: "Parking Fee", date: "2025-11-11", category: "Transportation" },
  { id: "33", amount: 150.00, status: "processing", description: "Car Maintenance", date: "2025-11-09", category: "Transportation" },
  { id: "34", amount: 95.25, status: "success", description: "Taxi", date: "2025-11-08", category: "Transportation" },
  
  // Shopping category
  { id: "7", amount: 890.5, status: "processing", description: "Online Shopping", date: "2025-11-06", category: "Shopping" },
  { id: "35", amount: 250.00, status: "success", description: "Clothing Store", date: "2025-11-14", category: "Shopping" },
  { id: "36", amount: 180.75, status: "success", description: "Electronics", date: "2025-11-13", category: "Shopping" },
  { id: "37", amount: 125.50, status: "pending", description: "Amazon Purchase", date: "2025-11-15", category: "Shopping" },
  { id: "38", amount: 95.00, status: "success", description: "Bookstore", date: "2025-11-12", category: "Shopping" },
  { id: "39", amount: 320.25, status: "success", description: "Furniture", date: "2025-11-10", category: "Shopping" },
  { id: "40", amount: 75.50, status: "success", description: "Home Decor", date: "2025-11-09", category: "Shopping" },
  { id: "41", amount: 210.00, status: "processing", description: "Department Store", date: "2025-11-07", category: "Shopping" },
  
  // Health category
  { id: "9", amount: 450.25, status: "failed", description: "Gym Membership", date: "2025-11-04", category: "Health" },
  { id: "42", amount: 120.00, status: "success", description: "Pharmacy", date: "2025-11-14", category: "Health" },
  { id: "43", amount: 85.50, status: "success", description: "Doctor Visit", date: "2025-11-13", category: "Health" },
  { id: "44", amount: 200.00, status: "success", description: "Dental Checkup", date: "2025-11-12", category: "Health" },
  { id: "45", amount: 65.75, status: "success", description: "Vitamins", date: "2025-11-11", category: "Health" },
  { id: "46", amount: 150.00, status: "processing", description: "Health Insurance", date: "2025-11-09", category: "Health" },
  
  // Entertainment category
  { id: "47", amount: 25.00, status: "success", description: "Movie Ticket", date: "2025-11-14", category: "Entertainment" },
  { id: "48", amount: 150.00, status: "success", description: "Concert Ticket", date: "2025-11-13", category: "Entertainment" },
  { id: "49", amount: 45.50, status: "success", description: "Streaming Service", date: "2025-11-12", category: "Entertainment" },
  { id: "50", amount: 85.00, status: "success", description: "Video Games", date: "2025-11-11", category: "Entertainment" },
  { id: "51", amount: 120.75, status: "pending", description: "Theater", date: "2025-11-15", category: "Entertainment" },
  { id: "52", amount: 65.25, status: "success", description: "Sports Event", date: "2025-11-10", category: "Entertainment" },
  { id: "53", amount: 95.50, status: "success", description: "Museum", date: "2025-11-08", category: "Entertainment" },
  
  // Education category
  { id: "54", amount: 500.00, status: "success", description: "Online Course", date: "2025-11-12", category: "Education" },
  { id: "55", amount: 250.00, status: "processing", description: "Books", date: "2025-11-11", category: "Education" },
  { id: "56", amount: 180.00, status: "success", description: "Workshop", date: "2025-11-09", category: "Education" },
  
  // Travel category
  { id: "57", amount: 850.00, status: "success", description: "Flight Ticket", date: "2025-11-07", category: "Travel" },
  { id: "58", amount: 320.00, status: "success", description: "Hotel Booking", date: "2025-11-06", category: "Travel" },
  { id: "59", amount: 150.00, status: "success", description: "Travel Insurance", date: "2025-11-05", category: "Travel" },
  { id: "60", amount: 95.50, status: "success", description: "Car Rental", date: "2025-11-04", category: "Travel" },


  { id: "61", amount: 78.78, status: "success", description: "movie", date: "2025-11-06", category: "Entertainment" },
];

