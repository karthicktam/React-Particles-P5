import React, { useState } from "react";
import Sketch from "react-p5";
import "./styles.css";

class Particle extends React.Component {
  constructor(props) {
    super(props);
    const { p5 } = props;
    this.pos = p5.createVector(p5.random(p5.width), p5.random(p5.height));
    this.vel = p5.createVector(p5.random(-2, 2), p5.random(-2, 2));
    this.size = 5;
  }

  update(p5) {
    this.pos.add(this.vel);
    this.edges(p5);
  }

  draw(p5) {
    p5.noStroke();
    p5.fill(`rgba(255, 255, 255, 0.5)`);
    p5.circle(this.pos.x, this.pos.y, this.size * 2);
  }

  edges(p5) {
    if (this.pos.x < 0 || this.pos.x > p5.width) {
      this.vel.x *= -1;
    }
    if (this.pos.y < 0 || this.pos.y > p5.height) {
      this.vel.y *= -1;
    }
  }

  createParticles(p5, particles) {
    particles.forEach((particle) => {
      const d = p5.dist(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
      if (d < 120) {
        const alpha = p5.map(d, 0, 120, 0, 0.25);
        p5.stroke(`rgba(255, 255, 255, ${alpha})`);
        p5.line(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
      }
    });
  }

  createPos(p5) {
    return p5.createVector(p5.random(p5.width), p5.random(p5.height));
  }

  createVelocity(p5) {
    return p5.createVector(p5.random(-2, 2), p5.random(-2, 2));
  }
}

export default function App() {
  const [particles, setParticles] = useState([]);

  const setup = (p5, parent) => {
    setParticles([]);
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(parent);

    const particlesLength = Math.min(Math.floor(window.innerWidth / 10), 100);
    for (let i = 0; i < particlesLength; i++) {
      setParticles((state) => [...state, new Particle({ p5: p5 })]);
    }
  };

  const draw = (p5) => {
    p5.background("salmon");

    particles.forEach((particle, idx) => {
      particle.update(p5);
      particle.draw(p5);
      particle.createParticles(p5, particles.slice(idx));
    });
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  return (
    <div className="app">
      <h1>Particles</h1>
      <Sketch windowResized={windowResized} setup={setup} draw={draw} />
    </div>
  );
}
