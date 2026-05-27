
  const keywords = {
    Food : ["swiggy", "zomato", "blinkit", "bigbasket"],
    Transport : ["uber", "ola", "rapido", "petrol"],
    Income : ["salary", "freelance", "dividend"],
    Entertainment : ["netflix", "youtube", "bookmyshow", "spotify"],
    Shopping : ["amazon", "flipkart", "hm", "myntra"],
    Bills : ["electricity", "water", "airtel", "rent"],
    Health : ["medical", "pharmacy", "gym"]
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