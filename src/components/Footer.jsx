import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className="footer sm:footer-horizontal bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100 p-6 ">
            <nav>
                <h6 className="footer-title">Social</h6>
                <div className="grid grid-flow-col gap-4">
                    <a
                        href="https://github.com/Gautam8963"
                        aria-label="GitHub"
                        className="hover:text-indigo-600 transition-colors duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            className="fill-current"
                        >
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.084-.729.084-.729 1.205.085 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.997.108-.775.418-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.933 0-1.31.467-2.382 1.235-3.22-.125-.303-.535-1.525.105-3.176 0 0 1.01-.323 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.553 3.3-1.23 3.3-1.23.64 1.651.23 2.873.11 3.176.77.838 1.23 1.91 1.23 3.22 0 4.61-2.807 5.625-5.48 5.92.43.37.82 1.102.82 2.222 0 1.606-.015 2.896-.015 3.286 0 .323.22.694.825.575C20.565 22.092 24 17.593 24 12.297c0-6.627-5.373-12-12-12z" />
                        </svg>
                    </a>
                    <a
                        href="https://www.linkedin.com/in/gautam-dhodi-848567237"
                        aria-label="LinkedIn"
                        className="hover:text-indigo-600 transition-colors duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            className="fill-current"
                        >
                            <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.06 20h-2.9v-8.68h2.9v8.68zm-1.45-9.86c-.93 0-1.68-.76-1.68-1.68 0-.93.75-1.68 1.68-1.68s1.68.75 1.68 1.68c0 .93-.76 1.68-1.68 1.68zm12.76 9.86h-2.9v-4.5c0-1.1-.04-2.51-1.53-2.51-1.54 0-1.77 1.2-1.77 2.44v4.57h-2.9v-8.68h2.78v1.2h.04c.38-.72 1.31-1.47 2.7-1.47 2.89 0 3.42 1.9 3.42 4.36v5.6z" />
                        </svg>
                    </a>
                    <a
                        href="https://x.com/GautamDhodi1"
                        aria-label="Twitter"
                        className="hover:text-indigo-600 transition-colors duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            className="fill-current"
                        >
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.723 0-4.932 2.21-4.932 4.932 0 .387.044.764.128 1.124-4.094-.205-7.725-2.165-10.148-5.144-.423.725-.667 1.562-.667 2.457 0 1.696.865 3.192 2.179 4.07-.803-.025-1.56-.247-2.229-.616-.054 1.956 1.26 3.794 3.137 4.208-.767.209-1.572.232-2.226.084.626 1.956 2.444 3.379 4.6 3.419-1.68 1.315-3.8 2.094-6.102 2.094-.397 0-.788-.023-1.17-.068 2.19 1.398 4.8 2.215 7.548 2.215 9.142 0 14.307-7.722 14.307-14.425 0-.219-.005-.435-.015-.652.983-.714 1.834-1.602 2.507-2.616z" />
                        </svg>
                    </a>
                </div>
            </nav>
        </footer>
    );
};

export default Footer;
