export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

 export function requestTimeout(func, delay) {
    let start = Date.now();
    function animate() {
      let current = Date.now();
      let elapsed = current - start;
      if (elapsed < delay) {
        requestAnimationFrame(animate);
      } else {
        func();
      }
    }
  
    requestAnimationFrame(animate);
}
  