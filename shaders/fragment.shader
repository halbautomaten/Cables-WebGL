#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D gradient;
uniform vec2 p[100];
uniform vec2 dimensions;

float sum = 0.0;

void main() {
  for(int i=0;i<100;i++){
    vec2 particle = p[i];
    particle.x = (particle.x+1.0)/2.0*dimensions.x;
    particle.y = (particle.y+1.0)/2.0*dimensions.y;

    sum += 1.0 / pow(distance(particle.xy, gl_FragCoord.xy), 2.0);
  }

  float s = sqrt(sum);

  float expansion = 10.0;
  float colorSelect = clamp(s*expansion, 0.0, 0.99);

  vec2 coordinate = vec2(colorSelect, 0.5);
  gl_FragColor = texture2D(gradient, coordinate).rgba;
}
