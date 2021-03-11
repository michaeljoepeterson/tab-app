/**
 * interface to represent a tab request to the service
 */
export interface TabRequest{
    tabName:string,
    description:string,
    strings:StringRequest[]
} 
/**
 * interface for a string request, arrays consolidated into a single string
 * for storage on teh DB
 */
export interface StringRequest{
    stringName:string,
    notes:string
} 