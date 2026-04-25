interface Bar{
    name:string;
    neighborhood:string;
    rating:number;
    happyHour:boolean;
    coverCharge:number;
    closes:number;
}

interface Edge{
    to:string;
    distance: number;
}

interface DiskstraResults{
    distance: Map<string, number>;
    previous: Map<string, string|null>;
}

interface CrawlStop {
    bar: Bar;
    arrivedAt: number;
    distanceFromPrev: number
}

class BarGraph {
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
    
dijkstra(start: string): DiskstraResults {
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
        mainRating?: number;
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
    const visted = new Set<string>();
    const crawl: CrawlStop[] = [];
    let current = start;
    let currentTime = startTime;

    const startBar = this.getBar(start);
    if (!startBar) return[];
    crawl.push({bar:startBar, arrivalTime: 0, distanceFromPrev:0});
    visted.add(start);

    while (crawl.length <maxStops){
        const {distance, previous} = this.dijkstra(current);
        let nextBar: string | null = null;
        let bestDist = Infinity;

        for (const [name, dist] of distances.entries()){

        }
    }
