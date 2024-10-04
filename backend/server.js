const express = require("express");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser"); // Add cookie-parser
const { csrfProtection } = require("./controllers/csrfController");
//import csrf route
const csrfRoutes = require("./routes/csrfRoutes");
// const {userdb} = require("./models/userModel");
const userdb = require("./models/userSchema");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

// Import Security Configuration
const securityConfig = require("./config/securityConfig");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const checkoutRoutes = require("./routes/stripeRoutes");

const driverRoutes = require("./routes/driverRoutes");
const deliverRoutes = require("./routes/deliverRoutes");

const inventoryRoutes = require("./routes/inventoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const releaseItemsRoutes = require("./routes/releaseItemsRoutes");

//staff management
const staffRoutes = require("./routes/staffRoutes");
//leave management
const leaveRoutes = require("./routes/leaveRoutes");
//payroll management
const payrollRoutes = require("./routes/payrollRoutes");

//Pet Management
const petRegisterRoutes = require("./routes/petRegisterRoutes");
const petTreatmentsRoutes = require("./routes/petTreatmentsRoutes");

//service management
const serviceRoutes = require("./routes/serviceRoutes");
//service records management
const servicerecordsRoutes = require("./routes/servicerecordsRoutes");

//veterinary management
const vetRoutes = require("./routes/vetRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const medicineRoutes = require("./routes/medicineRoutes");

//appointment management
const appointmentRoutes = require("./routes/appointmentRoutes");

const port = process.env.PORT || 4000;

const app = express();

// Apply security configurations
app.use(securityConfig());

// CSP violation reporting endpoint
app.post("/report-csp-violations", express.json(), (req, res) => {
  console.log("CSP Violation: ", req.body); // Log the CSP violation
  res.status(204).end(); // Respond with no content
});

// Configure CORS
// const corsOptions = {
//   origin: ['*'], // Replace with your frontend domains
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
//   credentials: true // Allow cookies and other credentials
// };

const clientid =
  "732622326141-s99km78p7e0kka0sphk2a7agh102ddfb.apps.googleusercontent.com";
const clientsecret = "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";

app.use(
  cors({
    origin: "http://localhost:3000", // No trailing slash
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"], // Allow Authorization header
    credentials: true, // Allow cookies and credentials
  })
);

// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Enable cookie-parser middleware

// Use CSRF routes
app.use("/api/csrf", csrfRoutes);

app.use(
  session({
    secret: "123weeweffefw21213",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: clientid,
      clientSecret: clientsecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile); // Log the full profile for debugging
      try {
        let user = await userdb.findOne({ googleId: profile.id });

        if (!user) {
          user = new userdb({
            googleId: profile.id,
            displayName: profile.displayName,
            username: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// initial google ouath login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/store",
    failureRedirect: "http://localhost:3000/login",
  })
);

app.get("/login/sucess", async (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "user Login", user: req.user });
  } else {
    res.status(400).json({ message: "Not Authorized" });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:3000");
  });
});

// Apply CSRF protection to state-changing routes
// app.use(csrfProtection); // Protect all POST, PUT, DELETE routes

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);

app.use("/api/drivers", driverRoutes);
app.use("/api/deliver-orders", deliverRoutes);

app.use("/api/inventory", inventoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/release-items", releaseItemsRoutes);

//staff management
app.use("/api/staff", staffRoutes);
//leave management
app.use("/api/leave", leaveRoutes);
//payroll management
app.use("/api/payroll", payrollRoutes);

//Pet Management
app.use("/api/pets", petRegisterRoutes);
app.use("/api/treatments", petTreatmentsRoutes);

//service management
app.use("/api/services", serviceRoutes);
//service records management
app.use("/api/servicerecords", servicerecordsRoutes);

//veterinary management
app.use("/api/vets", vetRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/medicines", medicineRoutes);

//appointment management
app.use("/api/appointments", appointmentRoutes);

app.use(errorHandler);

connectDB();

app.listen(port, () => console.log(`🚀 Server started on port ${port}`));
