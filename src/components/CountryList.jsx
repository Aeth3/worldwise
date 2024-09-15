// Import CSS styles from the CountryList.module.css file for styling
import styles from "./CountryList.module.css";
// Import the Message component from the Message.js file
import Message from "./Message";
// Import the CountryItem component from the CountryItem.js file
import CountryItem from "./CountryItem";
import { useCities } from "../hooks/useCities";

// Define the CountryList component which takes a prop called cities
function CountryList() {
  const { cities } = useCities();
  // If the cities array is empty, render a Message component with a message
  if (!cities.length)
    return (
      <Message
        message={"Add your first city by clicking on a city on the map"}
      />
    );

  // If the cities array is not empty, proceed with data transformation
  // Use the reduce method to iterate over the cities array and accumulate unique countries
  const countries = cities.reduce((arr, city) => {
    // Check if the current city's country already exists in the accumulated array
    if (!arr.map((el) => el.country).includes(city.country))
      // If the country doesn't exist, add it to the accumulated array along with its emoji
      return [...arr, { country: city.country, emoji: city.emoji }];
    // If the country already exists, return the accumulated array as is
    else return arr;
  }, []);

  // Render a list of countries
  return (
    <ul className={styles.countryList}>
      {countries.map((country, i) => (
        // For each country, render a CountryItem component and pass the country object as a prop
        <CountryItem key={i} country={country} />
      ))}
    </ul>
  );
}

// Export the CountryList component as the default export of the module
export default CountryList;
