//loader

$(window).on("load",function(){
  $(".loader-wrapper").fadeOut("50");
});


/////
        document.getElementById('renderport').style.padding = "10px";
        document.getElementById('ftr').style.position = 'relative';



        // module aliases
        var Engine = Matter.Engine,
            Events = Matter.Events,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Body = Matter.Body,
            Composite = Matter.Composite,
            Composites = Matter.Composites,
            Constraint = Matter.Constraint,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Vector = Matter.Vector;

        // create an engine
        var engine = Engine.create();

        // create a renderer
        var render = Render.create({
            element: document.getElementById('renderport'),
            engine: engine,
            options: {
                width: 1200,
                height: 500,
                //showVelocity: true,
                //showCollisions: true,
                wireframes: false,

                background: '#0f0f13'
            }
        });










        var wall1 = Bodies.rectangle(600, 0, 1200, 20, {isStatic:true,restitution:0,
            render: {
                fillStyle: 'white',
                strokeStyle: 'white',
                lineWidth: 3
            }
        });
        var wall2 = Bodies.rectangle(600, 500, 1200, 20, {isStatic:true, restitution:0,
            render: {
                fillStyle: 'white',
                strokeStyle: 'white',
                lineWidth: 3
            }
        });


        engine.world.gravity.y = 0;
       


        // add all of the bodies to the world
        World.add(engine.world, [wall1, wall2]);
      



     

        // add mouse control
        var mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });

        World.add(engine.world, mouseConstraint);

        render.mouse = mouse;




        // run the engine
        Engine.run(engine);

        // run the renderer
        Render.run(render);



function start(){
 
        //calculating values for simulation
        var mass = $("#mass").val(); //mass
        var efld = $("#efld").val(); //electric field
        var chrg = $("#chrg").val(); //charge
        var vel = $("#vel").val(); //velocity

        Forceapplied = chrg * efld; // using formula     F=qE  
  
 

        var ball = Bodies.circle(20, 250, 5, {
            friction: 0,
            frictionAir: 0,
            inverseInertia: 0
        });
  
   Matter.Body.setMass(ball, mass);
        Matter.Body.setVelocity(ball, {
            x: vel,
            y: 0
        });
    Matter.Events.on(engine, 'beforeUpdate', function (event) {
            Body.applyForce(ball, {
                x: ball.position.x,
                y: ball.position.y
            }, {
                x: 0,
                y: Forceapplied
            });

        });
  
  
  World.add(engine.world, [ball]);
     //add trail



        var trail = [];

        Events.on(render, 'afterRender', function () {
            trail.unshift({
                position: Vector.clone(ball.position),
                speed: ball.speed
            });

            Render.startViewTransform(render);
            render.context.globalAlpha = 0.7;

            for (var i = 0; i < trail.length; i += 1) {
                var point = trail[i].position,
                    speed = trail[i].speed;

                var hue = 250 + Math.round((1 - Math.min(1, speed / 10)) * 170);
                render.context.fillStyle = 'hsl(' + hue + ', 100%, 55%)';
                render.context.fillRect(point.x, point.y, 2, 2);
            }

            render.context.globalAlpha = 1;
            Render.endViewTransform(render);

            if (trail.length > 2000) {
                trail.pop();
            }
        });

  
}