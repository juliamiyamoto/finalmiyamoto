import { BarGraph, formatTime, printCrawl } from "./bar-hopping";
import type { Bar } from "./bar-hopping";

const graph = new BarGraph();

const bars: Bar[] = [
  { name: "Sundown Saloon", neighborhood: "Pearl Street",    rating: 5, happyHour: true,  coverCharge: 0, closes: 2 },
  { name: "Rosetta Hall",   neighborhood: "Pearl Street",    rating: 3, happyHour: false, coverCharge: 0, closes: 1 },
  { name: "The Attic",      neighborhood: "Pearl Street",    rating: 3, happyHour: true,  coverCharge: 0, closes: 1.5 },
  { name: "Press Play",     neighborhood: "Pearl Street",    rating: 1, happyHour: true,  coverCharge: 5, closes: 2 },
  { name: "The Sink",       neighborhood: "University Hill", rating: 4, happyHour: true,  coverCharge: 0, closes: 11 },
  { name: "Avanti",         neighborhood: "Pearl Street",    rating: 4, happyHour: false, coverCharge: 0, closes: 1 },
  { name: "Stella's",       neighborhood: "Pearl Street",    rating: 5, happyHour: false,  coverCharge: 0, closes: 12 },
  { name: "Rio Grande",     neighborhood: "Pearl Street",    rating: 4, happyHour: true,  coverCharge: 0, closes: 10 },
];

bars.forEach(b => graph.addBar(b));

// Walking times in minutes between bars

graph.addEdge("Rosetta Hall",   "The Attic",      2);
graph.addEdge("Rosetta Hall",   "Rio Grande",     4);
graph.addEdge("The Attic",      "Rio Grande",     3);


graph.addEdge("Sundown Saloon", "Press Play",     5);
graph.addEdge("Sundown Saloon", "Avanti",         6);
graph.addEdge("Press Play",     "Avanti",         4);


graph.addEdge("The Sink",       "Stella's",       4);


graph.addEdge("Rio Grande",     "Sundown Saloon", 5);
graph.addEdge("Rosetta Hall",   "Avanti",         7);
graph.addEdge("The Attic",      "Press Play",     6);
graph.addEdge("Avanti",         "The Sink",       14);
graph.addEdge("Sundown Saloon", "The Sink",       16);
graph.addEdge("Rio Grande",     "Stella's",       18);

const START_TIME = 20 * 60; 



console.log("\n EXAMPLE 1: Full crawl starting at Avanti");
const crawl1 = graph.planCrawl("Avanti", {
  maxStops: 6,
  startTime: START_TIME,
});
printCrawl(crawl1, START_TIME);



console.log("\n EXAMPLE 2: Happy hour only, free entry");
const crawl2 = graph.planCrawl("Sundown Saloon", {
  maxStops: 4,
  happyHourOnly: true,
  maxCoverCharge: 0,
  startTime: START_TIME,
});
printCrawl(crawl2, START_TIME);



console.log("\nEXAMPLE 3: Shortest path — The Sink to Press Play");
const { distance, previous } = graph.dijkstra("The Sink");
const path = graph.getPath(previous, "Press Play");
console.log(`Path: ${path.join(" → ")}`);
console.log(`Total walking time: ${distance.get("Press Play")} minutes`);



console.log("\n EXAMPLE 4: Rating 4+ only, starting at Avanti");
const crawl4 = graph.planCrawl("Avanti", {
  maxStops: 4,
  minRating: 4,
  startTime: START_TIME,
});
printCrawl(crawl4, START_TIME);