//import {Radio,Button} from "antd";
import {deleteStudent, getAllStudent} from "./client";
import './App.css';
import {useState,useEffect} from "react";
import {Table, Breadcrumb, Layout, Menu, theme, Empty, Button, Badge, Tag, Avatar, Popconfirm,Radio,Image} from 'antd';
import {
    PlusOutlined,
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import { Spin } from 'antd';
import StudentDrawerForm from "./StudentDrawerForm";
import {errorNotification, successNotification} from "./Notification";
import RadioGroupContext from "antd/es/radio/context";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items = [
    getItem('Option 1', '1', <PieChartOutlined />),
    getItem('Option 2', '2', <DesktopOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
];

const TheAvatar=({name})=>{
    let trim=name.trim();
    if(trim.length===0){
        return <Avatar icon={<UserOutlined/>}/>
    }
    const split =trim.split(" ");
    if(split.length===1){
        return <Avatar>{name.charAt(0)}</Avatar>
    }
    return <Avatar>
        {`${name.charAt(0)}${name.charAt(name.length-1)}`}
    </Avatar>
}

const removeStudent=(studentId,callback)=>{
    deleteStudent(studentId).then(()=>{
        successNotification("student deleted",`Student with ${studentId} was deleted`);
        callback();
    }).catch(err=>{
        console.log(err.response)
        err.response.json().then(res=>{
            console.log(res);
            errorNotification("There was an issue",`${res.message} [${res.status}] [${res.error}]`)
        })
    })
}
const columns = fetchStudent=>[
    {
        title:'',
        dataIndex: 'avatar',
        key: 'avatar',
        render:(text,student)=>
            <TheAvatar name={student.name}/>
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
        render:(text,student)=>
            <Radio.Group>
                <Popconfirm
                    placement="topRight"
                    title={`Are you sure to delete ${student.name}`}
                    onConfirm={()=>removeStudent(student.id,fetchStudent)}
                    okText="Yes"
                    cancelText="No">
                    <Radio.Button value="small">Delete</Radio.Button>
                </Popconfirm>
                <Radio.Button value="small">Edit</Radio.Button>
            </Radio.Group>
    },
];


function App() {
    const [students, setStudent]=useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [fetching, setFetching] = useState(true);
    const [showDrawer,setShowDrawer]= useState(false);

    const fetchStudent=()=>getAllStudent()
        .then(res=>res.json())
        .then(data=>{
            console.log(data);
            setStudent(data);
        }).catch(err=>{
            console.log(err.response)
            err.response.json().then(res=>{
                console.log(res);
                errorNotification("There was an issue",`${res.message} [${res.status}] [${res.error}]`)
            })
        }).finally(()=>setFetching(false))

    useEffect(()=>{
        console.log("print...");
        fetchStudent();
    },[])

    const renderStudents=()=>{
        if(fetching){
            return <Spin
                indicator={
                    <LoadingOutlined
                        style={{
                            fontSize: 24,
                        }}
                        spin
                    />
                }
            />
        }
        if(students.length<=0){
            return<>
                <Button
                    onClick={() => setShowDrawer((!showDrawer))}
                    type="primary" shape="round" icon={<PlusOutlined/>} size="large">Add New Student
                </Button>;
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudent={fetchStudent}
                />
                <Empty/>

            </>

        }
        return <>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudent={fetchStudent}
            />
            <Table
                dataSource={students}
                columns={columns(fetchStudent)}
                bordered
                title={() =>
                    <>
                        <Button
                            onClick={() => setShowDrawer((!showDrawer))}
                            type="primary" shape="round" icon={<PlusOutlined/>} size="large">Add New Student
                        </Button>
                        <br/><br/>
                        <Tag style={{marginLeft: "10px"}}>Number of Students</Tag>
                        <Badge count={students.length} className='site-badge-count-4'/>
                    </>

                }
                pagination={{ pageSize: 50 }} scroll={{ y: 500 }}
                rowKey={(student)=>student.id}
            />;
        </>
    }

    return (<Layout
        style={{
            minHeight: '100vh',
        }}
    >
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div className="demo-logo-vertical" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout>
            <Header
                style={{
                    padding: 0,
                    background: colorBgContainer,
                }}
            />
            <Content
                style={{
                    margin: '0 16px',
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                    }}
                >
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    style={{
                        padding: 24,
                        minHeight: 360,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >

                    {renderStudents()}
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                <Image
                    width={175}
                    src="https://github-production-user-asset-6210df.s3.amazonaws.com/122903592/293477670-36bc72de-d9fc-47c9-98cf-69a412d9e9ca.PNG?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20231230%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231230T194251Z&X-Amz-Expires=300&X-Amz-Signature=fc45eb6f9652b103fdb06b5518a34467b377a0c670c8036f80c0262e9210801b&X-Amz-SignedHeaders=host&actor_id=122903592&key_id=0&repo_id=734479704"
                />
            </Footer>
        </Layout>
    </Layout>)


    // return Student.map((s,index)=> {
    //     return <p key={index}>{s.id} {s.name}</p>
    // })



    // return (
    //     <div className="App">
    //       <Button type={"primary"}>Hello</Button>
    //         <br/>
    //       <Radio.Group value="large">
    //         <Radio.Button value="large">Large</Radio.Button>
    //         <Radio.Button value="default">Default</Radio.Button>
    //         <Radio.Button value="small">Small</Radio.Button>
    //       </Radio.Group>
    //     </div>
    // );
}

export default App;
