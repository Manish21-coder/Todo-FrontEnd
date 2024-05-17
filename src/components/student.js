import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import { Container, Paper, Button, Box } from '@mui/material';

export default function Student() {
    const paperStyle = { padding: '50px 20px', width: 600, margin: '30px auto' };
    const [name, setName] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [variant, setVariant] = React.useState('outlined');
    const [countdown, setCountdown] = React.useState(0);
    const [Students, setStudents] = React.useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const student = { name, address };
        console.log(student);
        setVariant('contained');

        fetch("http://localhost:8080/student", {
            method: "POST",
            headers: { "content-Type": "application/json" },
            body: JSON.stringify(student)
        }).then(() => {
            console.log("Student added");
            setCountdown(3); // Start countdown after form is submitted
            const countdownInterval = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
            setTimeout(() => {
                clearInterval(countdownInterval);
                setName('');
                setAddress('');
                setVariant('outlined');
                fetchStudents();
                setCountdown(0);
            }, 5000);
        });
    };

    const fetchStudents = () => {
        fetch("http://localhost:8080/student/Getall")
            .then(res => res.json())
            .then((result) => {
                setStudents(result);
            },[]);
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:8080/student/${id}`, {
            method: "DELETE",
            headers: { "content-Type": "application/json" }
        }).then(() => {
            console.log("Student deleted");
            fetchStudents(); // Refresh the list of students after deletion
        }).catch(error => {
            console.error("There was an error!", error);
        });
    };

    React.useEffect(() => {
        fetchStudents(); // Fetch students initially
    }, []);

    return (
        <Container>
            <Paper elevation={3} style={paperStyle}>
                <h1 style={{ color: 'blue' }}><u>Add Note</u></h1>
                <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <TextField
                        id="outlined-basic"
                        label="Name"
                        sx={{ marginBottom: 1 }}
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Task"
                        sx={{ marginBottom: 1 }}
                        variant="outlined"
                        fullWidth
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <Button type="submit" variant={variant} color="secondary">
                        Submit
                    </Button>
                </form>
                {countdown > 0 && <p>Resetting form in: {countdown} seconds...</p>}
            </Paper>
            <h1>To Do List</h1>
            <Paper elevation={3} style={paperStyle}>
                {Students.map(student => (
                    <Paper elevation={6} style={{ margin: "10px", padding: "15px", textAlign: "left" }} key={student.id}>
                        Task-No: {student.id}<br />
                        Name: {student.name}<br />
                        Task: {student.address}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
                            <Button variant="contained" startIcon={<DeleteIcon />} color="success" onClick={() => handleDelete(student.id)}>
                                Task Completed
                            </Button>
                        </Box>
                    </Paper>
                ))}
            </Paper>
        </Container>
    );
}
