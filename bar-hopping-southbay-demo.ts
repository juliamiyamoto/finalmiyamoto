import { BarGraph, formatTime, printCrawl } from "./bar-hopping";
import type { Bar } from "./bar-hopping";



const graph = new BarGraph();

const bars: Bar[] = [
  { name: "Tower 12",                  neighborhood: "Hermosa Beach",   rating: 4, happyHour: true,  coverCharge: 0,  closes: 2 },
  { name: "The Hangar Inn",            neighborhood: "Manhattan Beach", rating: 4, happyHour: true,  coverCharge: 0,  closes: 12 },
  { name: "The Strand House",          neighborhood: "Manhattan Beach", rating: 5, happyHour: false, coverCharge: 0,  closes: 9 },
  { name: "Purple Orchid",             neighborhood: "El Segundo", rating: 3, happyHour: true,  coverCharge: 5,  closes: 2 },
  { name: "Tony's on the Pier",        neighborhood: "Redondo Beach",   rating: 4, happyHour: true,  coverCharge: 0,  closes: 10 },
  { name: "Lighthouse",                neighborhood: "Hermosa Beach",   rating: 4, happyHour: true,  coverCharge: 5,  closes: 2 },
  { name: "The Poop Deck",             neighborhood: "Hermosa Beach",   rating: 3, happyHour: true,  coverCharge: 0,  closes: 12 },
  { name: "Shellback Tavern",          neighborhood: "Manhattan Beach", rating: 5, happyHour: true,  coverCharge: 0,  closes: 2 },
  { name: "New Starboard Attitude",    neighborhood: "Redondo Beach",   rating: 2, happyHour: true,  coverCharge: 0,  closes: 2 },
  { name: "Underground Pub and Grill", neighborhood: "Hermosa Beach",   rating: 4, happyHour: true,  coverCharge: 0,  closes: 1.5 },
];

bars.forEach(b => graph.addBar(b));


graph.addEdge("Shellback Tavern",          "The Hangar Inn",            3);
graph.addEdge("Shellback Tavern",          "The Strand House",          4);
graph.addEdge("The Hangar Inn",            "The Strand House",          4);
graph.addEdge("The Hangar Inn",            "Purple Orchid",             5);
graph.addEdge("The Strand House",          "Purple Orchid",             5);


graph.addEdge("Tower 12",                  "Lighthouse",                4);
graph.addEdge("Tower 12",                  "The Poop Deck",             5);
graph.addEdge("Tower 12",                  "Underground Pub and Grill", 6);
graph.addEdge("Lighthouse",                "The Poop Deck",             3);
graph.addEdge("Lighthouse",                "Underground Pub and Grill", 4);
graph.addEdge("The Poop Deck",             "Underground Pub and Grill", 3);


graph.addEdge("Tony's on the Pier",        "New Starboard Attitude",    5);


graph.addEdge("Shellback Tavern",          "Tower 12",                  12);
graph.addEdge("Purple Orchid",             "Tower 12",                  14);
graph.addEdge("Tower 12",                  "Tony's on the Pier",        16);
graph.addEdge("Underground Pub and Grill", "Tony's on the Pier",        14);
graph.addEdge("Shellback Tavern",          "Tony's on the Pier",        22);

const START_TIME = 20 * 60;


console.log("\nEXAMPLE 1: Full crawl starting at Tony's on the Pier");
const crawl1 = graph.planCrawl("Tony's on the Pier ", {
  maxStops: 6,
  startTime: START_TIME,
});
printCrawl(crawl1, START_TIME);



console.log("\nEXAMPLE 2: Happy hour only, free entry");
const crawl2 = graph.planCrawl("Shellback Tavern", {
  maxStops: 4,
  happyHourOnly: true,
  maxCoverCharge: 0,
  startTime: START_TIME,
});
printCrawl(crawl2, START_TIME);



console.log("\nEXAMPLE 3: Shortest path — Tower 12 to Shellback Tavern");
const { distance, previous } = graph.dijkstra("Tower 12");
const path = graph.getPath(previous, "Shellback Tavern");
console.log(`Path: ${path.join(" → ")}`);
console.log(`Total walking time: ${distance.get("Shellback Tavern")} minutes`);



console.log("\nEXAMPLE 4: Rating 4+ only, starting at Lighthouse");
const crawl4 = graph.planCrawl("Lighthouse", {
  maxStops: 4,
  minRating: 4,
  startTime: START_TIME,
});
printCrawl(crawl4, START_TIME);

