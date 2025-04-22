import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  TextField,
  Button,
  Box,
  Switch,
  Typography,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Chip,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { format } from "date-fns";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { BiCollapse } from "react-icons/bi";
import { LuExpand } from "react-icons/lu";
import Modal from "@mui/material/Modal";
import { useUser } from "../../Contexts/UserContext";

const UserControl = () => {
  const { user } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const departmentList = ["Sales", "Marketing", "Programming"];

  // Edit Table
  const [editingUserId, setEditingUserId] = useState(null);
  const [editableUser, setEditableUser] = useState({
    role: "",
    department: [],
  });

  const startEditing = (user) => {
    setEditingUserId(user.id);
    setEditableUser({ role: user.role, department: [...user.department] });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditableUser({ role: "", department: [] });
  };

  const handleEditableChange = (field, value) => {
    setEditableUser((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdits = async (userId) => {
    console.log("Saving edits for user:", userId, editableUser);
    try {
      await axios.patch(`${apiUrl}/auth/${userId}`, editableUser);
      fetchUsers();
      handleSuccess("User updated successfully");
      cancelEditing();
    } catch (error) {
      console.error("Error updating user:", error);
      handleError("Failed to update user.");
    }
  };

  // User Account Control
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    role: "Executive",
    department: [],
  });

  const handleOpenModal = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (event) => {
    const {
      target: { value },
    } = event;
    setSignupInfo((prev) => ({
      ...prev,
      department: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role, department } = signupInfo;

    if (!name || !email || !password || !role || !department) {
      return handleError("All fields are required.");
    }
    if (!email.endsWith("@snwareresearch.com")) {
      return handleError("Only @snwareresearch.com emails are allowed!");
    }
    if (!passwordRegex.test(password)) {
      return handleError(
        "Password must be at least 6 characters and include a letter, number, and special character."
      );
    }

    try {
      const response = await axios.post(`${apiUrl}/auth/signup`, signupInfo);
      const { success, message, error } = response.data;
      if (success) {
        fetchUsers();
        handleSuccess(message);
        setSignupInfo({
          name: "",
          email: "",
          password: "",
          role: "Executive",
          department: [],
        });
        setTimeout(() => handleClose(), 500);
      } else {
        handleError(error?.details?.[0]?.message || message);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      handleError(error.response?.data?.message || "Something went wrong!");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/auth`);
      const normalized = response.data.map((user) => ({
        ...user,
        id: user._id,
      }));
      setUsers(normalized);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formattedUsers = filteredUsers.map((row) => ({
    id: row._id,
    name: row.name,
    email: row.email,
    role: row.role,
    department: row.department,
    created_at: row.created_at
      ? format(new Date(row.created_at), "dd/MM/yyyy")
      : "N/A",
    is_active: row.is_active,
  }));

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await axios.patch(`${apiUrl}/auth/${id}`, { is_active: newStatus });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, is_active: newStatus } : user
        )
      );
      handleSuccess("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      handleError("Error updating status");
    }
  };

  return (
    <Box sx={{ width: "85%", boxShadow: "-5px 10px 5px rgb(0, 0, 0, 0.4)" }}>
      <Paper sx={{ mt: 1, p: 2, width: "100%", minWidth: "900px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <TextField
            label="Search by Name"
            type="text"
            variant="outlined"
            size="small"
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 350 }}
          />
          <Typography
            sx={{
              fontWeight: "bold",
              textDecoration: "underline",
              fontSize: 25,
              fontFamily: "ui-monospace",
              marginRight: 15,
              color: "#b3015c",
            }}
          >
            User Control Panel
          </Typography>

          <Button
            variant="contained"
            sx={{ background: "#b3015c" }}
            onClick={handleOpenModal}
          >
            Add
          </Button>
        </Box>

        <TableContainer sx={{ maxHeight: "calc(100vh - 250px)" }}>
          <Table stickyHeader size="small" sx={{ minWidth: "900px" }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <strong>S.No</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Name</strong>
                </TableCell>
                <TableCell sx={{ width: "300px", textAlign: "center" }}>
                  <strong>Email</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Departments</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Access</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Status</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formattedUsers.map((row, index) => {
                const isEditing = editingUserId === row.id;
                return (
                  <TableRow key={row.id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.email}</TableCell>

                    <TableCell align="center">
                      {isEditing ? (
                        <Select
                          multiple
                          value={editableUser.department}
                          onChange={(e) =>
                            handleEditableChange("department", e.target.value)
                          }
                          input={<OutlinedInput />}
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((value) => (
                                <Chip
                                  key={value}
                                  label={value}
                                  sx={{
                                    background: "#b3015c",
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                          size="small"
                        >
                          {departmentList.map((dept) => (
                            <MenuItem key={dept} value={dept}>
                              <Checkbox
                                checked={editableUser.department.includes(dept)}
                              />
                              <ListItemText primary={dept} />
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {row.department.map((dept) => (
                            <Chip
                              key={dept}
                              label={dept}
                              size="small"
                              sx={{
                                background: "#b3015c",
                                color: "#fff",
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      {isEditing ? (
                        <Select
                          value={editableUser.role}
                          onChange={(e) =>
                            handleEditableChange("role", e.target.value)
                          }
                          size="small"
                        >
                          <MenuItem value="Admin">Admin</MenuItem>
                          <MenuItem value="Manager">Manager</MenuItem>
                          <MenuItem value="Executive">Executive</MenuItem>
                        </Select>
                      ) : (
                        row.role
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <Switch
                        size="small"
                        checked={row.is_active === 1}
                        disabled={
                          row.role === "Super Admin" &&
                          user.role !== "Super Admin"
                        }
                        onChange={() =>
                          handleToggleStatus(row.id, row.is_active)
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#b3015c",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "#b3015c",
                            },
                          "& .MuiSwitch-switchBase": { color: "#f44336" },
                          "& .MuiSwitch-track": { backgroundColor: "#f44336" },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      {isEditing ? (
                        <>
                          <Button
                            onClick={() => saveEdits(row.id)}
                            variant="contained"
                            size="small"
                            sx={{ ml: 1, background: "#b3015c" }}
                          >
                            Save
                          </Button>
                          <Button
                            onClick={cancelEditing}
                            variant="outlined"
                            size="small"
                            sx={{ ml: 1 }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => startEditing(row)}
                          variant="text"
                          size="small"
                          sx={{ ml: 1 }}
                          disabled={
                            (row.role === "Super Admin" &&
                              user.role !== "Super Admin") ||
                            user.role === "Manager" ||
                            user.role === "Executive"
                          }
                        >
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isFullscreen ? "100vw" : 600,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton onClick={toggleFullscreen}>
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" gutterBottom>
            Add New User
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              margin="normal"
              value={signupInfo.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              value={signupInfo.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={signupInfo.password}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth sx={{ flex: 1 }}>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                required
                value={signupInfo.role}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="Admin" disabled={user.role === "Manager"}>
                  Admin
                </MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Executive">Executive</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Department</InputLabel>
              <Select
                multiple
                value={signupInfo.department}
                onChange={handleDepartmentChange}
                input={<OutlinedInput label="Department" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {departmentList.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    <Checkbox
                      checked={signupInfo.department.indexOf(dept) > -1}
                    />
                    <ListItemText primary={dept} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, background: "#b3015c" }}
            >
              Create User
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default UserControl;
