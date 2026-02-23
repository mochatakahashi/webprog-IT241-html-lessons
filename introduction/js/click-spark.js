// ============================================================
// ClickSpark - Full Page Click Spark Animation Overlay
// Pure Vanilla JS + Canvas — no React, no dependencies.
// ============================================================

(function () {
  const SPARK_COLOR  = '#9D65C9';
  const SPARK_SIZE   = 10;
  const SPARK_RADIUS = 15;
  const SPARK_COUNT  = 8;
  const DURATION     = 400;

  // Create and inject the canvas
  const canvas = document.createElement('canvas');
  canvas.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:100vw',
    'height:100vh',
    'pointer-events:none',
    'z-index:9999'
  ].join(';');
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let sparks = [];

  // Keep canvas sized to the viewport
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // ease-out: t*(2-t)
  function easeOut(t) {
    return t * (2 - t);
  }

  // Animation loop
  function draw(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sparks = sparks.filter(function (spark) {
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= DURATION) return false;

      const progress   = elapsed / DURATION;
      const eased      = easeOut(progress);
      const distance   = eased * SPARK_RADIUS;
      const lineLength = SPARK_SIZE * (1 - eased);

      const x1 = spark.x + distance                * Math.cos(spark.angle);
      const y1 = spark.y + distance                * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      ctx.strokeStyle = SPARK_COLOR;
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      return true;
    });

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  // Spawn sparks on every click
  document.addEventListener('click', function (e) {
    const now = performance.now();
    for (let i = 0; i < SPARK_COUNT; i++) {
      sparks.push({
        x:         e.clientX,
        y:         e.clientY,
        angle:     (2 * Math.PI * i) / SPARK_COUNT,
        startTime: now
      });
    }
  });

})();