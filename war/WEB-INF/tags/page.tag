<%@tag description="Overall Page template" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@attribute name="header" fragment="true"%>
<%@attribute name="footer" fragment="true"%>
<c:set var="req" value="${pageContext.request}" />
<c:set var="uri" value="${req.requestURI}" />
<!DOCTYPE html>
<html lang="en">
<head>
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
<base
	href="${fn:replace(req.requestURL, fn:substring(uri, 1, fn:length(uri)), req.contextPath)}" />
<meta charset="utf-8">
<title>DriverList</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">

<!-- Le styles -->
<link href="bootstrap/css/bootstrap.css" rel="stylesheet">
<style type="text/css">
body {
	padding-top: 60px;
	padding-bottom: 40px;
}

.sidebar-nav {
	padding: 9px 0;
}

.form-general {
	max-width: 800px;
	padding: 19px 29px 29px;
	margin: 0 auto 20px;
	background-color: #fff;
	border: 1px solid #e5e5e5;
	-webkit-border-radius: 5px;
	-moz-border-radius: 5px;
	border-radius: 5px;
	-webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, .05);
	-moz-box-shadow: 0 1px 2px rgba(0, 0, 0, .05);
	box-shadow: 0 1px 2px rgba(0, 0, 0, .05);
}

.form-general .form-signin-heading,.form-general .checkbox {
	margin-bottom: 10px;
}

.form-general input[type="text"],.form-general input[type="password"] {
	font-size: 16px;
	height: auto;
	margin-bottom: 15px;
	padding: 7px 9px;
}
</style>
<link href="bootstrap/css/bootstrap-responsive.css" rel="stylesheet">

<!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

<!-- Fav and touch icons -->
<link rel="apple-touch-icon-precomposed" sizes="144x144"
	href="../assets/ico/apple-touch-icon-144-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="114x114"
	href="../assets/ico/apple-touch-icon-114-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="72x72"
	href="../assets/ico/apple-touch-icon-72-precomposed.png">
<link rel="apple-touch-icon-precomposed"
	href="../assets/ico/apple-touch-icon-57-precomposed.png">
<link rel="shortcut icon" href="../assets/ico/favicon.png">
</head>

<body>

	<div class="navbar navbar-inverse navbar-fixed-top">
		<div class="navbar-inner">
			<div class="container-fluid">
				<a class="btn btn-navbar" data-toggle="collapse"
					data-target=".nav-collapse"> <span class="icon-bar"></span> <span
					class="icon-bar"></span> <span class="icon-bar"></span>
				</a> <a class="brand" href="/">DriverList</a>
				<div class="nav-collapse collapse">
					<ul class="nav">
						<li><a href="/dl/">Home</a></li>
						<li><a href="/dl/">Find driver</a></li>
						<li><a href="/dl/drivers/new">Add driver</a></li>
					</ul>
					<p class="navbar-text pull-right">
						<c:choose>
							<c:when test="${user != null}">
        	Jste přihlášen jako ${user.nickname}. <a href="${url}">Odhlásit
									se.</a>
							</c:when>
							<c:otherwise>
        	Nejste přihlášen. <a href="${url}">Přihlásit se.</a>
							</c:otherwise>
						</c:choose>
					</p>
				</div>
				<!--/.nav-collapse -->
			</div>
		</div>
	</div>
	<jsp:invoke fragment="header" />
	<div id="body">
		<c:if test="${not empty flashMessage}">
			<div class="alert alert-${flashMessage.type}">
				<a class="close" data-dismiss="alert">&#215;</a>
				${flashMessage.message}
			</div>
			<%
				session.setAttribute("flashMessage", null);
			%>
		</c:if>
		<div class="container-fluid">
			<div class="row-fluid">
				<div class="span3">
					<div class="well sidebar-nav">
						<ul class="nav nav-list">
							<li class="nav-header">Menu</li>
							<li><a href="/dl/">Find driver</a></li>
							<li><a href="/dl/drivers/new">Add driver</a></li>
						</ul>
					</div>
					<c:if test="${admin}">
						<jsp:include page="/views/menu/admin_menu.jsp" />
					</c:if>
					<!--/.well -->
				</div>
				<!--/span-->
				<div class="span9">
					<div class="row" style="margin-left: 0px">
						<jsp:doBody />

					</div>
				</div>
			</div>
			<!--/span-->
		</div>
		<!--/row-->

	</div>
	<hr>

	<footer>
		<p>&copy; DriverList 2013</p>
	</footer>

	</div>
	<!--/.fluid-container-->
</body>
</html>
<jsp:invoke fragment="footer" />
</body>
</html>