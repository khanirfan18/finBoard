
  const keywords = {
    Food : ["swiggy", "zomato", "blinkit", "bigbasket","Food"],
    Transport : ["uber", "ola", "rapido", "petrol", "Transport"],
    Income : ["salary", "freelance", "dividend","Income"],
    Entertainment : ["netflix", "youtube", "bookmyshow", "spotify","Entertainment"],
    Shopping : ["amazon", "flipkart", "hm", "myntra","Shopping"],
    Bills : ["electricity", "water", "airtel", "rent","Bills"],
    Health : ["medical", "pharmacy", "gym","Health"]
  }

export default function categorize(description) {

  const desc = description.toLowerCase()
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => desc.includes(word))) {
        return category
      }
    }
    return "Other"

    
}