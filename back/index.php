<?php
header('Content-Type:application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header("Access-Control-Allow-Headers: X-Requested-With");

$host = "localhost";
$usuario = "root";
$password = "";
$basededatos = "api";

$conexion1 = mysqli_connect($host, $usuario, $password);

if (!$conexion1) {
  die('No pudo conectarse' . mysqli_connect_errno());
}

$sql = 'CREATE DATABASE IF NOT EXISTS api';
if (mysqli_query($conexion1, $sql)) {
  // echo "database created successfully";
} else {
  // echo "Already database is exists" . mysqli_error($conexion1);
}

$conexion1->close();

$conexion2 = mysqli_connect($host, $usuario, $password, $basededatos);

if (!$conexion2) {
  die('No pudo conectarse' . mysqli_connect_errno());
}

$userTable = "
CREATE TABLE IF NOT EXISTS `api`.`usuarios` (`_id` INT NOT NULL AUTO_INCREMENT , `firstName` VARCHAR(255) NOT NULL , `lastName` VARCHAR(255) NOT NULL , `email` VARCHAR(255) NOT NULL , `phone` VARCHAR(20) NOT NULL , `typeEntry` VARCHAR(20) NOT NULL , PRIMARY KEY (`_id`)) ENGINE = InnoDB;";

if ($conexion2->query($userTable) === true) {
  // echo "Tabla creada en MySQL ";
} else {
  // echo "Error al crear tabla en MySQL " . $conexion2->error . " ";
}

$conexion2->close();

$conexion = mysqli_connect($host, $usuario, $password, $basededatos);

if (!$conexion) {
  die('No pudo conectarse' . mysqli_connect_errno());
}


$sql = 'CREATE DATABASE IF NOT EXISTS api';

if (mysqli_query($conexion, $sql)) {
  // echo "La base de datos mi_bd se creó correctamente\n";
} else {
  // echo 'Error al crear la base de datos';
}


$metodo = $_SERVER["REQUEST_METHOD"];

$path = isset($_SERVER["PATH_INFO"]) ? $_SERVER["PATH_INFO"] : '/';

$buscarId = explode('/', $path);

$id = ($path !== '/') ? end($buscarId) : null;


switch ($metodo) {
  case 'GET':
    consultaSelect($conexion, $id);
    break;

  case 'POST':
    insertar($conexion);
    break;

  case 'PUT':
    actualizar($conexion, $id);
    break;

  case 'DELETE':
    borrar($conexion, $id);
    break;

  default:
    echo 'Método no permitido';
    break;
}

function consultaSelect($conexion, $id)
{
  $sql = ($id === null) ? "SELECT * FROM usuarios" : "SELECT * FROM usuarios WHERE _id = $id";
  $resultado = $conexion->query($sql);

  if ($resultado) {
    $datos = array();
    while ($fila = $resultado->fetch_assoc()) {
      $datos[] = $fila;
    }
    echo json_encode($datos);
  }
}

function insertar($conexion)
{
  $firstName = $_POST["first-name"];
  $lastName = $_POST["last-name"];
  $email = $_POST["email"];
  $phone = $_POST["phone"];
  $typeOfEntry = $_POST["entry"];

  $sql = "INSERT INTO usuarios(firstName,lastName,email,phone,typeEntry) VALUES('$firstName','$lastName','$email','$phone','$typeOfEntry')";

  $resultado = $conexion->query($sql);

  if ($resultado) {
    $data = $conexion->insert_id;
    echo json_encode($data);
  } else {
    echo json_encode(array('error' => 'Error al crear usuario'));
  }
}

function borrar($conexion, $id)
{
  $sql = "DELETE FROM usuarios WHERE _id = $id";
  $resultado = $conexion->query($sql);

  if ($resultado) {
    echo json_encode(array('mensaje' => 'Usuario borrado'));
  } else {
    echo json_encode(array('error' => 'Error al eliminar usuario'));
  }
}

function actualizar($conexion, $id)
{
  $dato = json_decode(file_get_contents('php://input'), true);
  $firstName = $dato["first-name"];
  $lastName = $dato["last-name"];
  $email = $dato["email"];
  $phone = $dato["phone"];
  $typeOfEntry = $dato["entry"];

  $sql = "UPDATE usuarios SET firstName = '$firstName', lastName = '$lastName', email = '$email',phone = '$phone' ,typeEntry = '$typeOfEntry' WHERE _id = $id";
  $resultado = $conexion->query($sql);

  if ($resultado) {
    echo json_encode(array('mensaje' => 'Usuario actualizado'));
  } else {
    echo json_encode(array('error' => 'Error al actualizar usuario'));
  }
}
