export interface Bar{
    name:string;
    neighborhood:string;
    rating:number;
    happyHour:boolean;
    coverCharge:number;
    closes:number;
}

export interface Edge{
    to:string;
    distance: number;
}

export interface DijkstraResults{
    distance: Map<string, number>;
    previous: Map<string, string|null>;
}

export interface CrawlStop {
    bar: Bar;
    arrivalTime: number;
    distanceFromPrev: number;
}

export class BarGraph {
    private adjacency: Map<string, Edge[]> = new Map();
    private bars: Map<string, Bar> = new Map();

    addBar(bar: Bar): void {
        this.bars.set(bar.name, bar);
        if (!this.adjacency.has(bar.name)) {
            this.adjacency.set(bar.name, []);
        }
    }
    public addEdge(from: string, to: string, distanceMinutes:number):void{
        this.adjacency.get(from)?.push({to, distance: distanceMinutes});
        // add reverse edge
        this.adjacency.get(to)?.push({to: from, distance: distanceMinutes});
    }
    getBar(name: string): Bar | undefined {
        return this.bars.get(name);
    }
    getNeighbors(barName: string): Edge[] {
        return this.adjacency.get(barName) ?? [];
    }
    getAllBars(): Bar[] {
        return Array.from(this.bars.values());
    }
    hasBar(name: string): boolean {
        return this.bars.has(name);
    }
    
    dijkstra(start: string): DijkstraResults {
    const distance = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const visited = new Set<string>();

    for (const name of this.bars.keys()) {
        distance.set(name, Infinity);
        previous.set(name, null);
    }
    distance.set(start, 0);

    const queue: string[] = [start];
    while (queue.length > 0) {
        queue.sort((a, b) => (distance.get(a) ?? Infinity) - (distance.get(b) ?? Infinity));
        const current = queue.shift()!;
        if (visited.has(current)) continue;
        visited.add(current);
        for (const edge of this.getNeighbors(current)) {
            if (visited.has(edge.to)) continue;
            const newDist = (distance.get(current) ?? Infinity) + edge.distance;
            if (newDist < (distance.get(edge.to) ?? Infinity)) {
                distance.set(edge.to, newDist);
                previous.set(edge.to, current);
                queue.push(edge.to);
            }
        }
    }
    return { distance, previous };
}

getPath(previous:Map<string,string | null>, end:string): string[]{
    const path: string[] = [];
    let curr: string | null = end;
    while (curr){
        path.unshift(curr);
        curr = previous.get(curr) ?? null;
        
    }
    return path; 
}

planCrawl(
    start: string,
    options:{
        maxStops?: number;
        happyHourOnly?: boolean;
        maxCoverCharge?: number;
        minRating?: number;
        startTime?: number;
    }={}
): CrawlStop[]{
    const{
        maxStops = 5,
        happyHourOnly = false,
        maxCoverCharge = Infinity,
        minRating = 0,
        startTime = 20*60,
    } = options;
    const visited = new Set<string>();
    const crawl: CrawlStop[] = [];
    let current = start;
    let currentTime = startTime;

    const startBar = this.getBar(start);
    if (!startBar) return [];
    crawl.push({bar: startBar, arrivalTime: 0, distanceFromPrev: 0});
    visited.add(start);

    while (crawl.length < maxStops){
        const {distance, previous} = this.dijkstra(current);
        let nextBar: string | null = null;
        let bestDist = Infinity;

        for (const [name, dist] of distance.entries()){
            if (visited.has(name)) continue;
            const bar = this.getBar(name);
            if(!bar) continue;

            if (happyHourOnly && !bar.happyHour) continue;
            if (bar.coverCharge > maxCoverCharge) continue;
            if (bar.rating < minRating) continue;

            if (dist < bestDist){
                bestDist = dist;
                nextBar = name;
            }
        }

        if (!nextBar) break;

        const bar = this.getBar(nextBar)!;
        currentTime += bestDist + 60;
        crawl.push({
            bar,
            arrivalTime: currentTime - startTime,
            distanceFromPrev: bestDist,
        });
        visited.add(nextBar);
        current = nextBar;
    }
    return crawl;
}
}

class MinHeap{
    private heap: [number, string][]=[];
    insert(priority: number, name:string): void{
        this.heap.push([priority, name]);
        this._bubbleUp(this.heap.length - 1);
    }
    extractMin(): [number, string] | null{
        if (this.heap.length === 0) return null;
        const min = this.heap[0];
        const last = this.heap.pop()!;
        if (this.heap.length > 0){
            this.heap[0] = last;
            this._sinkDown(0);
        }
        return min;
    }
    get size(): number {return this.heap.length;}
private _bubbleUp(i:number):void{
        while(i>0){
            const parent = Math.floor((i-1)/2);
            if(this.heap[parent][0]<= this.heap[i][0]) break;
            [this.heap[parent], this.heap[i]]= [this.heap[i], this.heap[parent]];
            i= parent;
        }
    }
    private _sinkDown (i:number): void{
        const n= this.heap.length;
        while (true){
            let smallest = i;
            const left = 2 * i +1;
            const right = 2 *i+2;
            if (left < n && this.heap[left][0] <this.heap[smallest][0])smallest= left;
            if (right < n && this.heap[right][0] <this.heap[smallest][0])smallest= right;
            if (smallest === i) break;
            [this.heap[smallest], this.heap[i]]= [this.heap[i], this.heap[smallest]];
            i= smallest;
        }
    }
}

export function formatTime(minutesFromMidnight: number): string {
    const hours = Math.floor(minutesFromMidnight / 60) % 24;
    const minutes = minutesFromMidnight % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

export function printCrawl(crawl: CrawlStop[], startTime: number): void {
    console.log("Bar Crawl Itinerary:");
    console.log("=".repeat(50));
    crawl.forEach((stop,i) => {
        const arrivalTime = formatTime(stop.arrivalTime + startTime);
       const walk = stop.distanceFromPrev > 0 ? `(${stop.distanceFromPrev} min)` : "(start here)";
    console.log (`\nStop ${i+1}: ${stop.bar.name}${walk}`);
       console.log (`Arrival Time: ${arrivalTime}`);
       console.log (`Neighborhood: ${stop.bar.neighborhood}`);
       console.log (`  Rating: ${"★".repeat(stop.bar.rating)}${"☆".repeat(5 - stop.bar.rating)}`);
       console.log(`  Happy Hour: ${stop.bar.happyHour ? "Yes" : "No"}`);
    console.log(`  Cover: ${stop.bar.coverCharge === 0 ? "Free" : `$${stop.bar.coverCharge}`}`);
    console.log(`  Closes: ${stop.bar.closes}:00`);
  });
  console.log("\n" + "=".repeat(50));
  const totalWalk = crawl.reduce((sum, s) => sum + s.distanceFromPrev, 0);
  console.log(`Total walking: ${totalWalk} minutes across ${crawl.length} stops`);
}

