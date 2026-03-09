
1) What is the difference between var, let, and const?

var is function-scoped and can be re-declared and re-assigned.
let is block-scoped and can be re-assigned but not re-declared.
const is block-scoped and cannot be re-assigned or re-declared.




2) What is the spread operator (...)?

The spread operator (...) is used to expand elements of an array or object into individual elements.
It is commonly used to copy or merge arrays and objects.
Example:
const arr = [1,2,3];
const newArr = [...arr,4];





3) What is the difference between map(), filter(), and forEach()?

map() creates a new array by modifying each element.
filter() creates a new array with elements that match a condition.
forEach() only loops through the array and does not return a new array.





4) What is an arrow function?

An arrow function is a shorter way to write functions in JavaScript using =>.
Example:
const add = (a,b) => a + b;



5) What are template literals?

Template literals are strings written with backticks ( ) that allow variables to be inserted easily.
Example:
const name = "Rahim";
console.log(`Hello ${name}`);