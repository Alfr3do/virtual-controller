const MAX_CHANGE = 0.0001;

//const road = [[-80.18878,25.788299],[-80.18878,25.845706],[-80.119343,25.845706],[-80.119343,25.788299],[-80.18878,25.788299]]
const road = [[-80.181398,25.812332],[-80.146036,25.811327],[-80.138912,25.819981],[-80.13608,25.826239],[-80.131187,25.831492],[-80.134106,25.837595],[-80.132904,25.843698],[-80.128784,25.845706],[-80.134192,25.84617],[-80.131702,25.850109],[-80.14226,25.848719],[-80.146809,25.853662],[-80.145006,25.861],[-80.14183,25.871658],[-80.142088,25.885635],[-80.151014,25.887875],[-80.1614,25.878608],[-80.165176,25.867024],[-80.17024,25.867024],[-80.173244,25.841072],[-80.178652,25.8369],[-80.179853,25.832342],[-80.177279,25.823071],[-80.184145,25.814109]]
const obstacles =[[[-80.160027,25.843621],[-80.145006,25.844084],[-80.145779,25.849646],[-80.154276,25.849569],[-80.154362,25.850882],[-80.156851,25.850959],[-80.156851,25.856134],[-80.1614,25.855748],[-80.160027,25.843621]]] 
export class Vehicle {
  
  
  constructor() {
    this.position = {lat:25.824617,lon:-80.156593};
    this.heading = 0;
    this.velocity = 10;
    this.dampening = 0.01;
  }

  throtle(amount){
    if (Math.abs(amount) < 0.0001) return
    this.velocity += amount;
    if (this.velocity >= 0)
    this.velocity = Math.min(5,this.velocity)
    else
      this.velocity = Math.max(-5,this.velocity)
  
  }

  inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
    
    var x = point["lon"], y = point["lat"];
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    
    
    return inside;
};

  measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}
  //maximun change is 0.0001 ~ 10 meters
  roundToThree(num) {
    return +(Math.round(num + "e+3")  + "e-3");
  }
  move() {
    if (Math.abs(this.velocity) < 0.0001){
        this.velocity = 0;
        return;
    }
    const dLat = this.velocity*MAX_CHANGE*Math.sin(this.heading) 
    const dLon = this.velocity*MAX_CHANGE*Math.cos(this.heading)
    if (this.velocity > 0){
        //Move forward
        const new_pos = {lat:this.position.lat+dLat, lon:this.position.lon+dLon}
        var collide = false;
        for (var obs in obstacles){
          if (this.inside(new_pos,obstacles[obs])){
            collide = true
          }
        }
        if (this.inside(new_pos, road) && !collide)
          this.position = new_pos;
        this.velocity -= this.dampening
    }else{
        //Move backwards
        const new_pos = {lat:this.position.lat-dLat, lon:this.position.lon-dLon}
        var collide = false;
        for (obs in obstacles){
          if (this.inside(new_pos,obstacles[obs])){
            collide = true
          }
        }
        if (this.inside(new_pos, road) && !collide)
          this.position = new_pos;
        this.velocity += this.dampening
    }
    this.velocity = this.roundToThree(this.velocity)
  }
  rotate(amount){ 
        this.heading += amount
        while ( 2*Math.PI < this.heading ){
            this.heading -= 2*Math.PI
        }
        while ( this.heading < 0 ){
            this.heading += 2*Math.PI
        }
  }
}

