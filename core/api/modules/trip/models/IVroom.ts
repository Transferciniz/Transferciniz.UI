export interface VroomResponse {
    code: number;
    summary: Summary;
    unassigned: any[]; // Boş bir liste olduğundan, detaylandırabilirsiniz.
    routes: Route[];
  }
  
  interface Summary {
    cost: number;
    routes: number;
    unassigned: number;
    delivery: number[];
    amount: number[];
    pickup: number[];
    setup: number;
    service: number;
    duration: number;
    waiting_time: number;
    priority: number;
    distance: number;
    violations: any[]; // Violation yapısı detaylandırılabilir.
    computing_times: ComputingTimes;
  }
  
  interface ComputingTimes {
    loading: number;
    solving: number;
    routing: number;
  }
  
  interface Route {
    vehicle: number;
    cost: number;
    description: string;
    delivery: number[];
    amount: number[];
    pickup: number[];
    setup: number;
    service: number;
    duration: number;
    waiting_time: number;
    priority: number;
    distance: number;
    steps: Step[];
    violations: any[]; // Violation yapısı detaylandırılabilir.
    geometry: string;
  }
  
  interface Step {
    type: string; // "start", "job", "end" gibi değerler olabilir.
    location: [number, number]; // Enlem ve boylam değerleri.
    setup: number;
    service: number;
    waiting_time: number;
    load: number[];
    arrival: number;
    duration: number;
    violations: any[]; // Violation yapısı detaylandırılabilir.
    distance: number;
    description?: string; // Opsiyonel, bazı adımlarda bulunmayabilir.
    id?: number; // Opsiyonel, bazı adımlarda bulunmayabilir.
    job?: number; // Opsiyonel, bazı adımlarda bulunmayabilir.
  }