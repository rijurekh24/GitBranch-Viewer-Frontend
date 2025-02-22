import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import {
  AppBar,
  Avatar,
  Box,
  Card,
  CardContent,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Toolbar,
  Typography,
  Collapse,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { GitHub as GitHubIcon } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useNavigate } from "react-router-dom";
import LinkIcon from "@mui/icons-material/Link";
import { TextField } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [repos, setRepos] = useState([]);
  const [branches, setBranches] = useState({});
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [openRepos, setOpenRepos] = useState({});
  const [branchLoading, setBranchLoading] = useState({});
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      fetch("https://api.github.com/user/repos", {
        headers: { Authorization: `token ${user.accessToken}` },
      })
        .then((res) => res.json())
        .then((data) => setRepos(data))
        .catch((err) => console.error("Failed to fetch repos:", err));
    }
  }, [user]);

  const fetchBranches = async (repoName) => {
    if (!user || branches[repoName]) return;

    setBranchLoading((prev) => ({ ...prev, [repoName]: true }));

    try {
      const response = await fetch(
        `https://api.github.com/repos/${user.profile.username}/${repoName}/branches`,
        {
          headers: { Authorization: `token ${user.accessToken}` },
        }
      );
      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("Invalid branches response:", data);
        setBranchLoading((prev) => ({ ...prev, [repoName]: false }));
        return;
      }

      setBranches((prev) => ({ ...prev, [repoName]: data }));
      setBranchLoading((prev) => ({ ...prev, [repoName]: false }));
    } catch (err) {
      console.error("Failed to fetch branches:", err);
      setBranchLoading((prev) => ({ ...prev, [repoName]: false }));
    }
  };

  const handleRepoSelect = (repoName) => {
    if (selectedRepos.includes(repoName)) {
      setSelectedRepos(selectedRepos.filter((name) => name !== repoName));
      setOpenRepos((prev) => ({ ...prev, [repoName]: false }));
    } else {
      setSelectedRepos([...selectedRepos, repoName]);
      fetchBranches(repoName);
      setOpenRepos((prev) => ({ ...prev, [repoName]: true }));
    }
  };

  const handleToggle = (repoName) => {
    setOpenRepos((prev) => ({
      ...prev,
      [repoName]: !prev[repoName],
    }));
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        credentials: "include",
      });
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{ overflow: "hidden" }}
    >
      {/* Navbar */}
      <AppBar sx={{ bgcolor: "#010508", width: "100%", position: "sticky" }}>
        <Toolbar>
          <GitHubIcon sx={{ mr: 2, fontSize: 30 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            GitBranch Viewer
          </Typography>
          {user && (
            <Box display="flex" alignItems="center">
              <Typography variant="body1" sx={{ mr: 2, fontSize: "23px" }}>
                {user.profile.displayName}
              </Typography>
              <Avatar
                src={user.profile.photos[0].value}
                sx={{ border: "2px solid #999", mr: 2 }}
              />
              <IconButton color="inherit" onClick={handleLogout}>
                <ExitToAppIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        flex={1}
        sx={{ overflow: "auto", height: "calc(100vh - 64px)" }}
      >
        {/* Main Area - Repositories */}
        <Box
          flex={1}
          sx={{
            bgcolor: "rgb(33, 39, 49)",
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            // padding: 2,
          }}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            paddingX={2}
            pt={2}
            mb={1}
          >
            <Typography
              fontSize={"28px"}
              fontWeight={"bold"}
              letterSpacing={"1px"}
              color="#ccc"
            >
              {" "}
              Your Repositories
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search Repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                mb: 1,
                bgcolor: "#0C1017 ",
                borderRadius: 3,
                width: "40%",
                input: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                  "&:hover fieldset": { border: "none" },
                  "&.Mui-focused fieldset": { border: "none" },
                },
                "&::placeholder": { color: "#aaa" },
                "& input::placeholder": { color: "#aaa" },
              }}
            />
          </Box>

          <Divider
            sx={{
              bgcolor: "rgb(20, 25, 33) ",
            }}
          />
          <Box padding={2}>
            {filteredRepos.length === 0 ? (
              <Typography variant="body2">No repositories found.</Typography>
            ) : (
              <Grid container spacing={2}>
                {filteredRepos.map((repo) => (
                  <Grid item xs={12} sm={12} md={12} key={repo.id}>
                    <Card
                      sx={{ boxShadow: 3, bgcolor: "#0C1017", borderRadius: 3 }}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Box>
                            <Typography variant="h6">{repo.name}</Typography>
                            <Typography variant="caption" color="#aaa">
                              Last Updated: {formatDate(repo.updated_at)}
                            </Typography>

                            <Box>
                              {repo.private ? (
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                  mt={1}
                                >
                                  <LockIcon
                                    fontSize="small"
                                    sx={{ color: "#ccc" }}
                                  />
                                  <Typography variant="body2" color="#ccc">
                                    Private
                                  </Typography>
                                </Box>
                              ) : (
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                  mt={1}
                                >
                                  <PublicIcon
                                    fontSize="small"
                                    sx={{ color: "#ccc" }}
                                  />
                                  <Typography variant="body2" color="#ccc">
                                    Public
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>

                          <Box
                            display={"flex"}
                            textAlign={"center"}
                            justifyContent={"center"}
                            alignItems={"center"}
                          >
                            <IconButton
                              component="a"
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <LinkIcon mt={1} />
                            </IconButton>
                            <Checkbox
                              checked={selectedRepos.includes(repo.name)}
                              onChange={() => handleRepoSelect(repo.name)}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>

        {/* Sidebar - Branches */}
        <Box
          sx={{
            width: 400,
            bgcolor: "#0C1017",
            height: "calc(100vh - 64px)",
            overflowY: "auto",
          }}
        >
          {selectedRepos.length === 0 ? (
            <Box display={"flex"} alignItems={"center"}>
              <img
                src="https://img.icons8.com/?size=100&id=33277&format=png&color=ffffff"
                alt=""
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 10,
                  padding: "15px",
                }}
              />

              <Typography variant="body2" component={"span"}>
                Select a repository to view branches.
              </Typography>
            </Box>
          ) : (
            <List>
              {selectedRepos.map((repoName) => (
                <div key={repoName}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleToggle(repoName)}>
                      <Box
                        sx={{
                          display: "inline-block",
                          borderBottom: "1px solid #aaa",
                          pb: 0.5,
                        }}
                      >
                        <Typography variant="body1" color="#ccc">
                          {repoName}
                        </Typography>
                      </Box>

                      {openRepos[repoName] ? (
                        <ExpandLessIcon
                          sx={{
                            marginLeft: "auto",
                          }}
                        />
                      ) : (
                        <ExpandMoreIcon
                          sx={{
                            marginLeft: "auto",
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                  <Collapse
                    in={openRepos[repoName]}
                    timeout="auto"
                    unmountOnExit
                  >
                    {branchLoading[repoName] ? (
                      <Box sx={{ pl: 5 }}>
                        <Skeleton variant="text" width="80%" height={30} />
                        <Skeleton variant="text" width="60%" height={30} />
                      </Box>
                    ) : (
                      <List component="div" disablePadding>
                        {branches[repoName] &&
                        Array.isArray(branches[repoName]) ? (
                          branches[repoName].map((branch) => (
                            <ListItem key={branch.name} sx={{ pl: 4 }}>
                              <img
                                src="https://img.icons8.com/?size=100&id=33277&format=png&color=ffffff"
                                alt=""
                                style={{
                                  width: 20,
                                  height: 20,
                                  marginRight: 10,
                                }}
                              />
                              <ListItemText
                                primary={branch.name}
                                color="#ccc"
                              />
                            </ListItem>
                          ))
                        ) : (
                          <ListItem sx={{ pl: 4 }}>
                            <ListItemText primary="No branches found" />
                          </ListItem>
                        )}
                      </List>
                    )}
                  </Collapse>
                </div>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
