// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

#define PI     3.14159265359
#define TWO_PI 6.28318530718
uniform vec2 u_resolution;
uniform float u_time;

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float cross(in vec2 _st, float _size){
    return box(_st, vec2(_size,_size/4.)) +
           box(_st, vec2(_size/4.,_size));
}
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float circle(in vec2 st, in vec2 center, in float radius, in float border) {
    float aa = 0.003; //antialiasing
    float dist = distance(st, center);
    return smoothstep(radius + border + aa, radius + border, dist) - smoothstep(radius + aa, radius, dist);
}

float atan2(vec2 st) {
    return mod(atan(st.y, st.x) + PI/2., TWO_PI);
}

float revolving_circle(in vec2 st, in float radius, in float direction, in float parts) {
    st = rotate2d(direction * u_time) * st;
    st = scale(vec2(sin(mod(u_time, TWO_PI)) / 8. - 1.)) * st;
    vec2 polar = vec2(length(st), atan2(st));
    return circle(
        st, 
        vec2(0.), 
        radius + step(0., sin(polar.y * parts))/100. , 
        0.05
    );
}

vec2 p2c(in vec2 polar) {
    return polar.x * vec2(cos(polar.y), sin(polar.y));
}

vec2 p2c(in float r, in float a) {
    return r * vec2(cos(a), sin(a));
}

vec3 radar(in vec2 st, in float radius) {
    vec2 abs = st;
    st = rotate2d(u_time * 4.) * st;
    vec2 polar = vec2(length(st), atan2(st));

    vec3 rv = vec3(0);
    vec3 blip = vec3(1,0,0);
    rv += blip * smoothstep(0.05, 0.0, distance(abs, p2c(sin(u_time)/20. + radius / 2., mod(u_time * -1., TWO_PI))));
    return rv + vec3(step(polar.x, radius) * smoothstep(PI/2., PI, polar.y) * smoothstep(PI + 0.02, PI + 0.01, polar.y)) + vec3(circle(st, vec2(0.), radius, 0.01)) * vec3(0.9, 0.9, 0.);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    st -= vec2(0.5);
    float outer_circle = revolving_circle(st, 0.4, 1., 5.);
    float inner_circle = revolving_circle(st, 0.35, -1., 3.);
    
    // float part = 1.;step(0., polar.y - PI);
    color += vec3(outer_circle) * 
        vec3(0., 0.9, 0.6);
    color += vec3(inner_circle) * vec3(0.4, 1., 1.);
    
    color += radar(st, 0.28);
    gl_FragColor = vec4(color,1.0);
}

