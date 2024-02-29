import {broadcast} from "../library/EventsNetwork.ts";




export function onIntervalBroadcastInternalClockUpdated(identifier: string, seconds: number) {

  setInterval(function() {
    
    broadcast(identifier);
    
  }, toSeconds(seconds));
}




function toSeconds(number: number): number {

  return number * 1000;
}