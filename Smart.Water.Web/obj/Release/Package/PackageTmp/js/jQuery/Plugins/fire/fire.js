(function (a) {
    var b = { width: 200, height: 200 };
    window.requestAnimFrame = (function ()
    {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (c) {
            window.setTimeout(c, 6000 * 6)
        }
    })(); a.fn.extend({
        drawFlame: function (c) {
            var d = a.extend({}, b, c);
            this.each(function () {
                var k = a(this);
                k.width(d.width).height(d.height);
                var e = k.get(0).getContext("2d"); e.scale(2, 1);
                var l = function () {
                    this.speed = { x: -1 + Math.random() * 2, y: -5 + Math.random() * 5 };
                    //this.location = { x: d.width / 2 - 25, y: (d.height / 2 + 35) };
                    
                    this.location = { x: d.width  , y: d.height};
                    this.radius = 0.5 + Math.random() * 1;
                    this.life = 10 + Math.random() * 10;
                    this.death = this.life; this.r = 255;
                    this.g = Math.round(Math.random() * 155);
                    this.b = 0
                };
                var j = [];
                var g = 100;
                for (var h = 0; h < g; h++) {
                    j.push(new l())
                }
                var f = function () {
                    e.globalCompositeOperation = "source-in";
                    e.fillStyle = "transparent";
                    e.fillRect(0, 0, d.width, d.height);
                    e.globalCompositeOperation = "lighter";
                    for (var m = 0; m < j.length; m++) {
                        var o = j[m]; e.beginPath();
                        o.opacity = Math.round(o.death / o.life * 100) / 100;
                        var n = e.createRadialGradient(o.location.x, o.location.y, 0, o.location.x, o.location.y, o.radius);
                        n.addColorStop(0, "rgba(" + o.r + ", " + o.g + ", " + o.b + ", " + o.opacity + ")");
                        n.addColorStop(0.3, "rgba(" + o.r + ", " + o.g + ", " + o.b + ", " + o.opacity + ")");
                        n.addColorStop(1, "rgba(" + o.r + ", " + o.g + ", " + o.b + ", 0)"); e.fillStyle = n;
                        e.arc(o.location.x, o.location.y, o.radius, Math.PI * 2, false);
                        e.fill(); o.death--; o.radius++; o.location.x += (o.speed.x); o.location.y += (o.speed.y);
                        if (o.death < 0 || o.radius < 0) { j[m] = new l() }
                    } requestAnimFrame(f)
                }; f()
            })
        }
    })
})(jQuery);