// Run this in your browser console to create a demo user
// Or call this function when your app loads

export const setupDemoUser = () => {
  try {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    
    if (!existingUsers.find(u => u.email === "demo@music.com")) {
      const demoUser = {
        name: "Demo User",
        email: "demo@music.com",
        password: "demo123",
        avatar: "https://ui-avatars.com/api/?name=Demo+User&background=1DB954&color=fff",
        createdAt: new Date().toISOString()
      };
      
      existingUsers.push(demoUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));
      console.log("✅ Demo user created successfully!");
      console.log("Email: demo@music.com");
      console.log("Password: demo123");
    } else {
      console.log("Demo user already exists");
    }
  } catch (error) {
    console.error("Error setting up demo user:", error);
  }
};

// Automatically create demo user when this file is imported
if (typeof window !== 'undefined') {
  setupDemoUser();
}