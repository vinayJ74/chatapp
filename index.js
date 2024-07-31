import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState, CSSProperties } from "react";
import 'bootstrap/dist/css/bootstrap.css';

import { md, sanitize } from "../helpers/markdown";
import { compiler } from '@/next.config';

import ClipLoader from "react-spinners/ClipLoader";


const CHAT_GPT_API = 'https://api.openai.com/v1/chat/completions';
const API_KEY = 'ADD_YOUR_API';

const usaCities = {
  '': ['Undefined'],
  'Alabama': ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville'],
  'Alaska': ['Anchorage', 'Fairbanks', 'Juneau'],
  'Arizona': ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale'],
  'Arkansas': ['Little Rock', 'Fort Smith', 'Fayetteville'],
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
  'Colorado': ['Denver', 'Colorado Springs', 'Boulder'],
  'Connecticut': ['Bridgeport', 'New Haven', 'Hartford'],
  'Delaware': ['Wilmington', 'Dover', 'Newark'],
  'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
  'Georgia': ['Atlanta', 'Savannah', 'Augusta'],
  'Hawaii': ['Honolulu', 'Hilo', 'Kailua'],
  'Idaho': ['Boise', 'Nampa', 'Meridian'],
  'Illinois': ['Chicago', 'Springfield', 'Peoria'],
  'Indiana': ['Indianapolis', 'Fort Wayne', 'South Bend'],
  'Iowa': ['Des Moines', 'Cedar Rapids', 'Davenport'],
  'Kansas': ['Wichita', 'Overland Park', 'Kansas City'],
  'Kentucky': ['Louisville', 'Lexington', 'Bowling Green'],
  'Louisiana': ['New Orleans', 'Baton Rouge', 'Shreveport'],
  'Maine': ['Portland', 'Bangor', 'Lewiston'],
  'Maryland': ['Baltimore', 'Annapolis', 'Rockville'],
  'Massachusetts': ['Boston', 'Cambridge', 'Springfield'],
  'Michigan': ['Detroit', 'Grand Rapids', 'Lansing'],
  'Minnesota': ['Minneapolis', 'St. Paul', 'Rochester'],
  'Mississippi': ['Jackson', 'Gulfport', 'Southaven'],
  'Missouri': ['Kansas City', 'St. Louis', 'Springfield'],
  'Montana': ['Billings', 'Missoula', 'Great Falls'],
  'Nebraska': ['Omaha', 'Lincoln', 'Bellevue'],
  'Nevada': ['Las Vegas', 'Reno', 'Henderson'],
  'New Hampshire': ['Manchester', 'Nashua', 'Concord'],
  'New Jersey': ['Newark', 'Jersey City', 'Trenton'],
  'New Mexico': ['Albuquerque', 'Santa Fe', 'Las Cruces'],
  'New York': ['New York City', 'Buffalo', 'Rochester'],
  'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro'],
  'North Dakota': ['Fargo', 'Bismarck', 'Grand Forks'],
  'Ohio': ['Cleveland', 'Columbus', 'Cincinnati'],
  'Oklahoma': ['Oklahoma City', 'Tulsa', 'Norman'],
  'Oregon': ['Portland', 'Salem', 'Eugene'],
  'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Harrisburg'],
  'Rhode Island': ['Providence', 'Warwick', 'Cranston'],
  'South Carolina': ['Charleston', 'Columbia', 'Greenville'],
  'South Dakota': ['Sioux Falls', 'Rapid City', 'Aberdeen'],
  'Tennessee': ['Nashville', 'Memphis', 'Knoxville'],
  'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio'],
  'Utah': ['Salt Lake City', 'Provo', 'Orem'],
  'Vermont': ['Burlington', 'Essex', 'Rutland'],
  'Virginia': ['Richmond', 'Virginia Beach', 'Norfolk'],
  'Washington': ['Seattle', 'Spokane', 'Tacoma'],
  'West Virginia': ['Charleston', 'Huntington', 'Morgantown'],
  'Wisconsin': ['Milwaukee', 'Madison', 'Green Bay'],
  'Wyoming': ['Cheyenne', 'Casper', 'Laramie']
};

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export default function Home() {

  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");

  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    days: "",
    content: "",
    restaurants: ""
  });


  const [restaurants, setRestaurant] = useState("");
  const [trip, setTrip] = useState("");



  const handleChange = (e) => {

    console.log(e.target.value);
    console.log(e.target);

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const contentMap = {
    "trip": "Act as an expert travel agent. I will give you a location and number of days, give me a complete trip for those days in the form of a table. Give me day wise breakdown and include bars, clubs, hikes, and other attractions that I can visit. Give this in a markdown format.",
    "restaurants": "Act as an expert travel agent. I will give you a state, city and days. Give me the list of restaurants, bars, and dance clubs that I can visit during those days in that city. Divide the 3 with proper headings and return in markdown format."
  };


  const makeMyTrip = async () => {
    findEverything("trip");

    findEverything("restaurants");

    setLoading(false);
  }

  const findEverything = async (tripDetails) => {
    console.log("optimizing");

    setLoading(true);

    let content = contentMap[tripDetails] || "";

    try {
      // show loading indicator
      const loader = document.createElement("div");
      loader.classList.add(styles.loader);
      document.body.appendChild(loader);

      const response = await fetch(CHAT_GPT_API, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            "role": "user",
            "content": content
          }, {
            "role": "user",
            "content": `${formData.state} state, ${formData.city} city for ${formData.days} days`
          }]
        })
      });

      const data = await response.json();
      console.log(data.choices[0].message.content);

      if (tripDetails === "trip") {
        setTrip(data.choices[0].message.content);
      } else {
        setRestaurant(data.choices[0].message.content);
      }

    } catch (error) {
      console.error(error.message);
    }
  };

  const states = Object.keys(usaCities);

  const sampleCity = usaCities["Alabama"];

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.column}>

          <h3>Select state</h3>
          <select className={styles.input} name="state" value={formData.state} onChange={handleChange}>
            {states.map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>

          <h3>Select city</h3>
          <select className={styles.input} name="city" value={formData.city} onChange={handleChange}>
            {usaCities[formData.state].map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>


          <h3>Number of days</h3>
          <input className={styles.input} type="text" aria-label="days" aria-describedby="basic-addon1" />


          <button type="button"
            class="btn btn-primary my-3"
            onClick={() => makeMyTrip()}>
            Generate my trip
          </button>
        </div>

        {loading &&
          <ClipLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        }

        {!loading &&
          <>
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{
                __html: sanitize(md.render(trip)),
              }}
            >
            </div>


            <div
              className={styles.content}
              dangerouslySetInnerHTML={{
                __html: sanitize(md.render(restaurants)),
              }}
            >
            </div>
          </>
        }

      </main>
    </div >
  )
}
