#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

float ellipse(in vec2 st, in float middle, in float span) {
    return distance(st, vec2(middle - span, 0.5)) + distance(st, vec2(middle + span, 0.5));
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;
    float pct = 1.0;

    float circle = distance(st,vec2(0.5));
    // a. The DISTANCE from the pixel to the center
    float dist = ellipse(st, 0.5, 0.3 + sin(u_time) / 30.);
    
    float shape_radius = 0.8 + sin(u_time)/10.;
    float border = 0.03;
    
    pct = step(shape_radius, dist);
    pct *= (1. - step(shape_radius + border, dist));
    
    // b. The LENGTH of the vector
    //    from the pixel to the center
    // vec2 toCenter = vec2(0.5)-st;
    // pct = length(toCenter)

    // c. The SQUARE ROOT of the vector
    //    from the pixel to the center
    // vec2 tC = vec2(0.5)-st;
    // pct = sqrt(tC.x*tC.x+tC.y*tC.y);
	vec2 toCenter = vec2(0.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;
    
    float time = u_time * 0.3;
    
    vec3 color = vec3(pct);
	color *= hsb2rgb(vec3((angle/TWO_PI)+0.5 + time,radius,1.0));
	gl_FragColor = vec4( color, 1.0 );
}
