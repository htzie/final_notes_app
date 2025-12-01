pipeline {
    agent any

    triggers {
        // Poll SCM as fallback if webhook fails
        pollSCM('H/2 * * * *')
    }

    environment {
        // Build Information
        BUILD_TAG = "${env.BUILD_NUMBER}"
        // GIT_COMMIT_SHORT will be set in the Checkout stage
    }

    parameters {
        booleanParam(
            name: 'CLEAN_VOLUMES',
            defaultValue: true,
            description: 'Remove volumes (clears database)'
        )
        string(
            name: 'API_HOST',
            defaultValue: 'http://127.0.0.1:3001',
            description: 'API host URL for frontend to connect to (for builds).'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "=== Stage: Checkout ==="
                    echo "Checking out code from SCM..."
                    checkout scm

                    echo "Resolving short Git commit hash..."
                    env.GIT_COMMIT_SHORT = sh(
                        returnStdout: true,
                        script: 'git rev-parse --short HEAD'
                    ).trim()

                    echo "Deploying to production environment"
                    echo "Build Number : ${env.BUILD_TAG}"
                    echo "Git Commit   : ${env.GIT_COMMIT_SHORT}"
                }
            }
        }

        stage('Validate') {
            steps {
                script {
                    echo "=== Stage: Validate Docker Compose ==="
                    sh 'echo "Running: docker compose config"'
                    sh 'docker compose config'
                    echo "Docker Compose configuration is valid ✅"
                }
            }
        }

        stage('Prepare Environment') {
            steps {
                script {
                    echo "=== Stage: Prepare Environment (.env) ==="

                    // Load credentials from Jenkins
                    withCredentials([
                        string(credentialsId: 'MYSQL_ROOT_PASSWORD', variable: 'MYSQL_ROOT_PASS'),
                        string(credentialsId: 'MYSQL_PASSWORD',     variable: 'MYSQL_PASS')
                    ]) {
                        sh """
                            echo "Creating .env file for Docker Compose..."
                            cat > .env <<EOF
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASS}
MYSQL_DATABASE=notes_app
MYSQL_USER=notes_user
MYSQL_PASSWORD=${MYSQL_PASS}
MYSQL_PORT=3306
PHPMYADMIN_PORT=8888
API_PORT=3001
DB_PORT=3306
FRONTEND_PORT=3000
NODE_ENV=production
API_HOST=${params.API_HOST}
EOF
                        """
                    }

                    echo ".env file created successfully ✅ (content hidden for security)"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo "=== Stage: Deploy with Docker Compose ==="

                    // Stop existing containers
                    def downCommand = 'docker compose down'
                    if (params.CLEAN_VOLUMES) {
                        echo "⚠️ CLEAN_VOLUMES = true → Removing volumes (database will be cleared)"
                        downCommand = 'docker compose down -v'
                    } else {
                        echo "CLEAN_VOLUMES = false → Keeping existing volumes and data"
                    }

                    sh """
                        echo "Stopping existing containers..."
                        ${downCommand} || true
                    """

                    sh """
                        echo "Building Docker images (no cache)..."
                        docker compose build --no-cache
                    """

                    sh """
                        echo "Starting containers in detached mode..."
                        docker compose up -d
                    """

                    echo "Docker Compose deployment completed ✅"
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "=== Stage: Health Check ==="
                    echo "Waiting a few seconds for services to initialize..."
                    sh 'sleep 15'

                    echo "Checking container status:"
                    sh 'docker compose ps'

                    echo "Waiting for API health endpoint to be ready..."
                    sh '''
                        set -e
                        for i in {1..30}; do
                          echo "  [API] Health check attempt $i/30..."
                          if curl -fsS http://localhost:3001/health > /dev/null; then
                            echo "  [API] Health check passed ✅"
                            exit 0
                          fi
                          sleep 2
                        done
                        echo "  [API] Health check FAILED after 30 attempts ❌"
                        exit 1
                    '''

                    echo "Checking frontend homepage..."
                    sh '''
                        set -e
                        curl -fsS http://localhost:3000 > /dev/null
                        echo "  [Frontend] Homepage reachable ✅"
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    echo "=== Stage: Verify Deployment ==="

                    sh """
                        echo "=== Container Status ==="
                        docker compose ps

                        echo ""
                        echo "=== Recent Logs (last 20 lines) ==="
                        docker compose logs --tail=20 || true

                        echo ""
                        echo "=== Service URLs ==="
                        echo "Frontend : http://localhost:3000"
                        echo "API      : http://localhost:3001"
                        echo "phpMyAdmin: http://localhost:8888"
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment completed successfully!"
            echo "Build : ${env.BUILD_TAG}"
            echo "Commit: ${env.GIT_COMMIT_SHORT}"

            echo ""
            echo "Access your application:"
            echo "  - Frontend  : http://localhost:3000"
            echo "  - API       : http://localhost:3001/health"
            echo "  - phpMyAdmin: http://localhost:8888"
        }

        failure {
            echo "❌ Deployment failed!"
            script {
                echo "Printing container logs for debugging (last 50 lines)..."
                sh 'docker compose logs --tail=50 || true'
            }
        }

        always {
            echo "=== Post-build cleanup: Docker prune ==="
            sh """
                echo "Removing dangling images..."
                docker image prune -f || true

                echo "Removing stopped containers..."
                docker container prune -f || true
            """
        }
    }
}
