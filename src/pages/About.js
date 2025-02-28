import React from 'react';
import Navbar from '../components/Navbar/Navbar';

const About = () => {
  return (
    <div className='min-h-screen overflow-auto'>
      <Navbar/>

      <div className="min-h-screen flex flex-col items-center bg-gray-100 overflow-auto">
        <div className="container mx-auto py-8">
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p>
              Our mission is to push the boundaries of space exploration and scientific discovery. We are dedicated to developing cutting-edge technologies and innovative solutions that enable humanity to explore the cosmos. Through our research and missions, we aim to gather crucial data, foster international collaboration, and inspire future generations of scientists, engineers, and space enthusiasts.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p>
              We envision a future where humanity is a multi-planetary species, living and thriving on other worlds. Our vision is to create the foundation for sustainable human presence in space, paving the way for colonization of planets like Mars. By advancing space technologies and conducting groundbreaking research, we strive to make this vision a reality.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Our Values</h2>
            <p>
              We are guided by a set of core values that drive our work and define our approach to space exploration:
              <ul className="list-disc ml-6 mt-2">
                <li>Innovation: Continuously pushing the boundaries of what is possible.</li>
                <li>Collaboration: Working together with international partners to achieve common goals.</li>
                <li>Integrity: Conducting our work with the highest ethical standards.</li>
                <li>Excellence: Striving for the best in everything we do.</li>
                <li>Inspiration: Encouraging and motivating the next generation of space explorers.</li>
              </ul>
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Our History</h2>
            <p>
              Our World has been at the forefront of space exploration and research. From launching our first satellite to sending missions to Mars, we have consistently achieved milestones that have expanded our understanding of the universe. Our journey has been marked by innovation, perseverance, and a relentless pursuit of knowledge.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Our Team</h2>
            <p>
              Our team is composed of some of the brightest minds in the fields of science, engineering, and technology. Together, we are dedicated to exploring the unknown and pushing the limits of human capability. Meet our leaders, scientists, engineers, and support staff who make our mission possible.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-20">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="">
              We are always open to collaboration and inquiries. If you have any questions, ideas, or would like to get involved, please reach out to us at [community page]. We look forward to connecting with you and working together to explore the final frontier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
