const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dateFns = require("date-fns");
var XLSX = require("xlsx");

const uri =
  "mongodb+srv://djangoadmin:zpxHwEVKtbGsYIP6@cluster0.0ube0.mongodb.net/Login_system?retryWrites=true&w=majority";
const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 3000;
const Schema = mongoose.Schema;

mongoose.connect(uri, (err) => {
  if (err) {
    console.log("Unable to connect");
  } else {
    console.log("Connected to mongodb successfully");
  }
});

const userSchema = new Schema({
  name: String,
  email: String,
  date_created: { type: Date, default: Date.now() },
  password: String,
});

const employeeSchema = new Schema({
  name: String,
  email: String,
  employee_type: String,
  date_joined: { type: Date, default: Date.now() },
  date_left: { type: Date, default: null },
  is_active: { type: Boolean, default: true },
});

const attendanceSchema = new Schema({
  year: Number,
  months: Number,
  date: Number,
  emp_ids: [mongoose.Types.ObjectId],
});

const userModel = mongoose.model("users", userSchema);
const employeeModel = mongoose.model("employee", employeeSchema);
const attendanceModel = mongoose.model("attendance", attendanceSchema);

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    res.status(401).send({ msg: "unauthorized no token" });
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    res.status(401).send({ msg: "unauthorized tn" });
  }
  jwt.verify(token, "secretkey", (err, payload) => {
    if (err) {
      res.status(401).send({ msg: "unauthorized tinvalid" });
    } else {
      userModel.findById({ _id: payload.id }, (err, data) => {
        if (err) {
          res.status(401).send({ msg: "unable to login user" });
        } else {
          if (data.email !== payload.email) {
            res.status(401).send({ msg: "invalid user" });
          } else {
            req.userData = payload;
            next();
          }
        }
      });
    }
  });
}

function getTodayDate() {
  let today = new Date(Date.now());
  let year = today.getFullYear();
  let month = today.getMonth();
  let date = today.getDate();
  // console.log("->", year, month, date, today);
  return [year, month, date];
}

async function getDates(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate.setHours(0, 0, 0, 0));

  const addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
}

async function getEmpAttendanceOnDate(date, month, year, emp_id) {
  const attendance = await attendanceModel
    .findOne({
      year: year,
      months: month,
      date: date,
    })
    .exec();
  if (attendance) {
    for (let emp of attendance.emp_ids) {
      if (emp.valueOf() === emp_id) {
        return true;
      }
    }
    return false;
  }
  return false;
}

async function getEmpAttendance(emp_data) {
  let emp_id = emp_data._id;
  // year month date
  let join_date = emp_data.date_joined;
  const dates_arr = await getDates(join_date, new Date(Date.now()));
  let data = [];
  for (let date of dates_arr) {
    let pr = await getEmpAttendanceOnDate(
      date.getDate(),
      date.getMonth(),
      date.getFullYear(),
      emp_id.valueOf(),
    );
    data.push({ date: date, is_present: pr });
  }
  return data;
}

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.post("/register-user", (req, res) => {
  userModel.findOne({ email: req.body.email }, (err, data) => {
    if (data) {
      res.status(409).send({ msg: "user already exists" });
    } else {
      const userObj = new userModel({ ...req.body, adminUser: false });
      userObj
        .save()
        .then(() => {
          res.status(200).send({ msg: "user registered successfully" });
        })
        .catch((err) => {
          res.status(500).send({ msg: "unable to register user" });
        });
    }
  });
});

app.post("/register-admin", verifyToken, (req, res) => {
  userModel.findOne({ email: req.body.email }, (err, data) => {
    if (data) {
      res.status(409).send({ msg: "user already exists" });
    } else {
      const userObj = new userModel({ ...req.body });
      userObj
        .save()
        .then(() => {
          res.status(200).send({ msg: "user registered successfully" });
        })
        .catch((err) => {
          res.status(500).send({ msg: "unable to register user" });
        });
    }
  });
});

app.post("/register-employee", verifyToken, (req, res) => {
  const employeeObj = new employeeModel({ ...req.body });
  employeeObj
    .save()
    .then(() => {
      res.status(200).send({ msg: "employee added successfully" });
    })
    .catch((err) => {
      res.status(500).send({ msg: "unable to add employee" });
    });
});

app.get("/get-employees", (req, res) => {
  employeeModel.find({}, "_id email name date_joined", (err, data) => {
    if (err) {
      res.status(401).send({ msg: "error fetching data" });
    } else {
      for (let obj in data) {
        data[obj] = data[obj].toObject();
      }
      employeeModel.aggregate(
        [
          {
            $group: {
              _id: { $toLower: "$employee_type" },
              count: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: null,
              counts: {
                $push: { k: "$_id", v: "$count" },
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: { $arrayToObject: "$counts" },
            },
          },
        ],
        (err, count_data) => {
          if (err) {
            res.status(401).send({ msg: "error fetching data" });
          } else {
            let [year, month, date] = getTodayDate();

            attendanceModel.findOne(
              {
                year: year,
                months: month,
                date: date,
              },
              (err, attendance_data) => {
                if (err) {
                  res.status(401).send({ msg: "error fetching data" });
                } else {
                  var attendance_arr = [...attendance_data.emp_ids];
                  attendance_arr = attendance_arr.map((x) => x.valueOf());

                  for (let d in data) {
                    if (attendance_arr.includes(data[d]._id.valueOf())) {
                      data[d]["present"] = true;
                    } else {
                      data[d]["present"] = false;
                    }
                  }
                  res.status(200).send({ data: data, stats: count_data[0] });
                }
              },
            );
          }
        },
      );
    }
  });
});

app.get("/change-employee-attendance", (req, res) => {
  let emp_id = req.query["emp_id"] || null;
  let action = req.query["action"] || null;
  let fulldate = req.query["date"] || null;

  if (emp_id === null || action === null) {
    res.status(403).send({ msg: "Invalid request" });
  } else {
    if (fulldate == "null") {
      var [year, month, date] = getTodayDate();
    } else {
      fulldate = new Date(fulldate);
      var date = fulldate.getDate();
      var month = fulldate.getMonth();
      var year = fulldate.getFullYear();
    }

    if (action === "true") {
      // add in todays list
      attendanceModel.findOneAndUpdate(
        {
          year: year,
          months: month,
          date: date,
        },
        {
          $push: { emp_ids: emp_id }, // pull for delete
        },
        (err, data) => {
          if (err) {
            res.status(401).send({ msg: "unable to make changes" });
          } else {
            res.status(200).send({ msg: "changes made" });
          }
        },
      );
    } else {
      // removce from todays list
      attendanceModel.findOneAndUpdate(
        {
          year: year,
          months: month,
          date: date,
        },
        {
          $pull: { emp_ids: emp_id }, // pull for delete
        },
        (err, data) => {
          if (err) {
            res.status(401).send({ msg: "unable to make changes" });
          } else {
            res.status(200).send({ msg: "changes made" });
          }
        },
      );
    }
  }
});
//By Ritesh Arora
app.post("/upload-employee-attendance", async (req, res) => {
  console.log("sds", req.body);
  const bodyDate = new Date(req.body.date);
  var workbook = XLSX.readFile("attendance.xlsx");
  var sheet_name_list = workbook.SheetNames;
  //parse data
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  let year = bodyDate.getFullYear();
  let month = bodyDate.getMonth();
  let date = bodyDate.getDate();
  //remove if previously present
  await attendanceModel.findOneAndDelete({
    year: year,
    month: month,
    date: date,
  });
  await attendanceModel.create({
    year: year,
    months: month,
    date: date,
    emp_ids: [],
  });
  let data = {
    total_emp: 0,
    absent_emp: 0,
    present_emp: 0,
    present_emp_list: [],
    absent_emp_list: [],
  };
  //set sheet data
  const total_emp = xlData;
  if (total_emp) {
    data["total_emp"] = total_emp.length;
    //empty prefilled date

    for (let emp of total_emp) {
      // console.log(emp.action);
      if (emp.action == "P") {
        attendanceModel.findOneAndUpdate(
          {
            year: year,
            months: month,
            date: date,
          },
          {
            $push: { emp_ids: emp._id }, // push for add
          },
          (err, data) => {
            if (err) {
              res.status(401).send({ msg: "unable to make changes" });
            }
          },
        );
        data["present_emp_list"].push(emp);
        data["present_emp"] += 1;
      } else {
        attendanceModel.findOneAndUpdate(
          {
            year: year,
            months: month,
            date: date,
          },
          {
            $pull: { emp_ids: emp._id }, // pull for delete
          },
          (err, data) => {
            if (err) {
              res.status(401).send({ msg: "unable to make changes" });
            }
          },
        );
        data["absent_emp_list"].push(emp);
        data["absent_emp"] += 1;
      }
    }
    // console.log("-> ", data);
    res.status(200).send(data);
  } else {
    res.status(401).send({ msg: "Error fetching total_emp" });
  }
});
////////////////////////////////////////////////
app.get("/employee-attendance-list", verifyToken, async (req, res) => {
  let [year, month, date] = getTodayDate();
  let data = [
    {
      emp_id: "sas",
      emp_name: "c",
      total: "d2",
      present: "d",
      absent: "d2" - "d",
    },
  ];

  const emp_list = await employeeModel.find({}).exec();
  // now we have employee list

  for (let emp of emp_list) {
    const query_data = {
      year: emp.date_joined.getFullYear(),
      months: emp.date_joined.getMonth(),
      date: emp.date_joined.getDate(),
    };
    const da = await attendanceModel.find(query_data).exec();
  }
});

app.get("/get-employee/:id", async (req, res) => {
  let emp_data = await employeeModel.findById({ _id: req.params["id"] }).exec();
  if (emp_data) {
    let [year, month, date] = getTodayDate();
    let isPresent = await getEmpAttendanceOnDate(
      date,
      month,
      year,
      emp_data._id.valueOf(),
    );
    let emp_attendance = await getEmpAttendance(emp_data);
    res.status(200).send({
      data: emp_data,
      present: isPresent,
      attendance_data: emp_attendance,
    });
  } else {
    res.status(404).send({ msg: "error fetching data" });
  }
});

app.post("/login", async (req, res) => {
  const query_res = await userModel.findOne({ email: req.body.email }).exec();
  if (query_res) {
    if (query_res.password !== req.body.password) {
      res.status(401).send({ msg: "password don't match" });
    } else {
      // create today attendance registry
      let [year, month, date] = getTodayDate();

      const query_data = {
        year: year,
        months: month,
        date: date,
      };

      const attendance_entry = await attendanceModel.findOne(query_data).exec();

      if (!attendance_entry) {
        const obj = new attendanceModel(query_data);
        obj
          .save()
          .then(() => {
            let tokenData = {
              id: query_res._id,
              name: query_res.name,
              email: query_res.email,
            };
            const token = jwt.sign(tokenData, "secretkey");
            res.status(200).send({ token, name: query_res.name });
          })
          .catch(() => {
            res.status(401).send({ msg: "error fetching data" });
          });
      } else {
        let tokenData = {
          id: query_res._id,
          name: query_res.name,
          email: query_res.email,
        };
        const token = jwt.sign(tokenData, "secretkey");
        res.status(200).send({ token, name: query_res.name });
      }
    }
  } else {
    res.status(401).send({ msg: "User does not exist" });
  }
});

app.get("/get-dashboard-data", async (req, res) => {
  let data = {
    total_emp: 0,
    absent_emp: 0,
    present_emp: 0,
  };
  let [year, month, date] = getTodayDate();
  const total_emp = await employeeModel.find({});
  if (total_emp) {
    data["total_emp"] = total_emp.length;
    const emp_list = await attendanceModel.findOne({
      year: year,
      months: month,
      date: date,
    });

    if (emp_list) {
      data["present_emp"] = emp_list.emp_ids.length;
      data["absent_emp"] = data["total_emp"] - data["present_emp"];
      res.status(200).send(data);
    } else {
      res.status(401).send({ msg: "Error fetching data" });
    }
  } else {
    res.status(401).send({ msg: "Error fetching data" });
  }
});

app.get("/get-overall-data", verifyToken, async (req, res) => {
  let data = {
    total_emp: 0,
    absent_emp: 0,
    present_emp: 0,
  };
  let [year, month, date] = getTodayDate();
  const emps = await employeeModel.find({}).exec();
  let attendance_data_list = [];
  if (emps) {
    data["total_emp"] = emps.length;
    const emp_list = await attendanceModel.findOne({
      year: year,
      months: month,
      date: date,
    });
    if (emp_list) {
      data["present_emp"] = emp_list.emp_ids.length;
      data["absent_emp"] = data["total_emp"] - data["present_emp"];
      for (let emp of emps) {
        let emp_attendance = await getEmpAttendance(emp);
        let present = 0;
        if (emp_attendance) {
          for (let attendance of emp_attendance) {
            if (attendance.is_present) {
              present++;
            }
          }
        }
        attendance_data_list.push({
          emp_id: emp._id,
          emp_name: emp.name,
          total: emp_attendance.length,
          present: present,
          absent: emp_attendance.length - present,
        });
      }
      res.status(200).send({ ...data, attendance_data: attendance_data_list });
    } else {
      res.status(401).send({ msg: "Error fetching data" });
    }
  } else {
    res.status(404).send({ msg: "error fetching data" });
  }
});

app.get("/attendance-summary", async (req, res) => {
  let fulldate = new Date(req.query["date"]);
  let date = fulldate.getDate();
  let month = fulldate.getMonth();
  let year = fulldate.getFullYear();
  let data = {
    total_emp: 0,
    absent_emp: 0,
    present_emp: 0,
    present_emp_list: [],
    absent_emp_list: [],
  };
  const total_emp = await employeeModel.find({}, "_id name email").exec();
  if (total_emp) {
    data["total_emp"] = total_emp.length;
    const emp_list = await attendanceModel
      .findOne({
        year: year,
        months: month,
        date: date,
      })
      .exec();

    if (emp_list) {
      data["present_emp"] = emp_list.emp_ids.length;
      data["absent_emp"] = data["total_emp"] - data["present_emp"];

      for (let emp of total_emp) {
        let pre = false;
        for (let id of emp_list.emp_ids) {
          if (id.valueOf() === emp.id.valueOf()) {
            data["present_emp_list"].push(emp);
            pre = true;
            break;
          }
        }
        if (!pre) {
          data["absent_emp_list"].push(emp);
        }
      }

      res.status(200).send(data);
    } else {
      res.status(401).send({ msg: "Error fetching emp_list" });
    }
  } else {
    res.status(401).send({ msg: "Error fetching total_emp" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
});
