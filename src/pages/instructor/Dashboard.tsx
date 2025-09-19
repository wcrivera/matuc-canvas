// ============================================================================
// DASHBOARD INSTRUCTOR - MATUC LTI EXERCISE COMPOSER FRONTEND
// ============================================================================
// Archivo: src/pages/instructor/Dashboard.tsx
// Propósito: Dashboard principal para instructores con exercise sets reales
// Compatible con backend API y navegación completa

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Settings,
  Play,
  Pause,
  Archive,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import {
  getExerciseSets,
  getExerciseSetsByFilters,
  deleteExerciseSet,
  togglePublishExerciseSet,
  EXERCISE_SET_CONSTANTS
} from '../../services/exerciseSetService';
import { ExerciseSetBase, PaginatedResponse } from '../../types/shared';
import { checkApiHealth } from '../../services/api';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface DashboardStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
}

interface Filters {
  search: string;
  estado: 'all' | 'draft' | 'published' | 'archived';
  sortBy: 'newest' | 'oldest' | 'title';
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Estados principales
  const [exerciseSets, setExerciseSets] = useState<ExerciseSetBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isApiHealthy, setIsApiHealthy] = useState<boolean | null>(null);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Estados de filtros
  const [filters, setFilters] = useState<Filters>({
    search: '',
    estado: 'all',
    sortBy: 'newest'
  });

  // Estados de estadísticas
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0
  });

  // Estados de UI
  const [showFilters, setShowFilters] = useState(false);
  const [operatingId, setOperatingId] = useState<string | null>(null);

  // ============================================================================
  // EFECTOS
  // ============================================================================

  // Cargar datos iniciales
  useEffect(() => {
    loadExerciseSets();
    checkApiHealth().then(setIsApiHealthy);
  }, [currentPage, filters]);

  // Calcular estadísticas cuando cambian los datos
  useEffect(() => {
    if (exerciseSets.length > 0) {
      const newStats: DashboardStats = {
        total: totalItems,
        published: exerciseSets.filter(e => e.estado === 'published').length,
        draft: exerciseSets.filter(e => e.estado === 'draft').length,
        archived: exerciseSets.filter(e => e.estado === 'archived').length
      };
      setStats(newStats);
    }
  }, [exerciseSets, totalItems]);

  // ============================================================================
  // FUNCIONES DE DATOS
  // ============================================================================

  const loadExerciseSets = async () => {
    try {
      setLoading(true);

      const filterParams: any = {
        page: currentPage,
        limit: EXERCISE_SET_CONSTANTS.DEFAULT_PAGE_SIZE
      };

      if (filters.search.trim()) {
        filterParams.search = filters.search.trim();
      }

      if (filters.estado !== 'all') {
        filterParams.estado = filters.estado;
      }

      const response: PaginatedResponse<ExerciseSetBase> = filters.search || filters.estado !== 'all'
        ? await getExerciseSetsByFilters(filterParams)
        : await getExerciseSets({ page: currentPage, limit: EXERCISE_SET_CONSTANTS.DEFAULT_PAGE_SIZE });

      setExerciseSets([...response.items]);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
      setCurrentPage(response.page);

    } catch (error) {
      console.error('Error loading exercise sets:', error);
      toast.error('Error al cargar exercise sets');
      setExerciseSets([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadExerciseSets();
    setRefreshing(false);
    toast.success('Datos actualizados');
  };

  // ============================================================================
  // HANDLERS DE ACCIONES
  // ============================================================================

  const handleCreateNew = () => {
    navigate('/instructor/create-exercise');
  };

  const handleView = (exerciseSet: ExerciseSetBase) => {
    navigate(`/instructor/exercise/${exerciseSet.id}`);
  };

  const handleEdit = (exerciseSet: ExerciseSetBase) => {
    navigate(`/instructor/exercise/${exerciseSet.id}/edit`);
  };

  const handleDelete = async (exerciseSet: ExerciseSetBase) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${exerciseSet.titulo}"?`)) {
      return;
    }

    try {
      setOperatingId(exerciseSet.id);
      await deleteExerciseSet(exerciseSet.id);
      toast.success('Exercise set eliminado');
      await loadExerciseSets();
    } catch (error) {
      toast.error('Error al eliminar exercise set');
    } finally {
      setOperatingId(null);
    }
  };

  const handleTogglePublish = async (exerciseSet: ExerciseSetBase) => {
    const newPublishedState = !exerciseSet.publicado;
    const action = newPublishedState ? 'publicar' : 'despublicar';

    if (!window.confirm(`¿Estás seguro de que quieres ${action} "${exerciseSet.titulo}"?`)) {
      return;
    }

    try {
      setOperatingId(exerciseSet.id);
      await togglePublishExerciseSet(exerciseSet.id, newPublishedState);
      toast.success(`Exercise set ${newPublishedState ? 'publicado' : 'despublicado'}`);
      await loadExerciseSets();
    } catch (error) {
      toast.error(`Error al ${action} exercise set`);
    } finally {
      setOperatingId(null);
    }
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // ============================================================================
  // COMPONENTES DE RENDER
  // ============================================================================

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <Card.Content>
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-full">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
            </div>
          </div>
        </Card.Content>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <Card.Content>
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-full">
              <Play className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Publicados</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.published}</p>
            </div>
          </div>
        </Card.Content>
      </Card>

      <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
        <Card.Content>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500 rounded-full">
              <Edit className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Borradores</p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{stats.draft}</p>
            </div>
          </div>
        </Card.Content>
      </Card>

      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20">
        <Card.Content>
          <div className="flex items-center">
            <div className="p-3 bg-gray-500 rounded-full">
              <Archive className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Archivados</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.archived}</p>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );

  const renderToolbar = () => (
    <Card className="mb-6">
      <Card.Content>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar exercise sets..."
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="pl-10"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>

            <Button onClick={handleCreateNew} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Crear Exercise Set
            </Button>
          </div>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado
                </label>
                <select
                  value={filters.estado}
                  onChange={(e) => handleFilterChange({ estado: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">Todos</option>
                  <option value="draft">Borradores</option>
                  <option value="published">Publicados</option>
                  <option value="archived">Archivados</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ordenar por
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="newest">Más recientes</option>
                  <option value="oldest">Más antiguos</option>
                  <option value="title">Por título</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => handleFilterChange({ search: '', estado: 'all', sortBy: 'newest' })}
                  className="w-full"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </Card.Content>
    </Card>
  );

  const renderExerciseCard = (exerciseSet: ExerciseSetBase) => {
    const isOperating = operatingId === exerciseSet.id;

    return (
      <motion.div
        key={exerciseSet.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="hover:shadow-lg transition-shadow">
          <Card.Header>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {exerciseSet.titulo}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                  {exerciseSet.descripcion}
                </p>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {/* Status Badge */}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${exerciseSet.estado === 'published'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                    : exerciseSet.estado === 'draft'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200'
                  }`}>
                  {exerciseSet.estado === 'published' ? 'Publicado' :
                    exerciseSet.estado === 'draft' ? 'Borrador' : 'Archivado'}
                </span>
              </div>
            </div>
          </Card.Header>

          <Card.Content>
            <div className="space-y-3">
              {/* Exercise Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(exerciseSet.fechaCreacion).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {exerciseSet.configuracion.intentos} intentos
                </div>
              </div>

              {/* Questions Count */}
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                <Users className="h-4 w-4 mr-2" />
                {exerciseSet.preguntas.length} preguntas
              </div>
            </div>
          </Card.Content>

          <Card.Footer>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(exerciseSet)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(exerciseSet)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTogglePublish(exerciseSet)}
                  disabled={isOperating}
                  className={exerciseSet.publicado ? 'text-orange-600' : 'text-green-600'}
                >
                  {exerciseSet.publicado ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                  {exerciseSet.publicado ? 'Despublicar' : 'Publicar'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(exerciseSet)}
                  disabled={isOperating}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
          </Card.Footer>
        </Card>
      </motion.div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Card className="mt-6">
        <Card.Content>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {((currentPage - 1) * EXERCISE_SET_CONSTANTS.DEFAULT_PAGE_SIZE) + 1} - {Math.min(currentPage * EXERCISE_SET_CONSTANTS.DEFAULT_PAGE_SIZE, totalItems)} de {totalItems} exercise sets
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm text-gray-600 dark:text-gray-400">
                Página {currentPage} de {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <Card className="text-center py-12">
      <Card.Content>
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No hay exercise sets
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {filters.search || filters.estado !== 'all'
            ? 'No se encontraron exercise sets con los filtros aplicados.'
            : 'Aún no has creado ningún exercise set. ¡Comienza creando tu primer exercise set!'
          }
        </p>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Crear Exercise Set
        </Button>
      </Card.Content>
    </Card>
  );

  const renderAPIWarning = () => {
    if (isApiHealthy === false) {
      return (
        <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
          <Card.Content>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                <Settings className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Problema de conectividad
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  No se puede conectar con el servidor backend. Los datos mostrados pueden no estar actualizados.
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      );
    }
    return null;
  };

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard del Instructor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tus exercise sets con preguntas anidadas.
          </p>
        </div>

        {/* API Warning */}
        {renderAPIWarning()}

        {/* Stats */}
        {renderStats()}

        {/* Toolbar */}
        {renderToolbar()}

        {/* Exercise Sets List */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Cargando exercise sets...</p>
          </div>
        ) : exerciseSets.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {exerciseSets.map(renderExerciseCard)}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {renderPagination()}

        {/* Debug Info (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-8 bg-gray-50 dark:bg-gray-800">
            <Card.Content>
              <details>
                <summary className="text-sm font-medium text-gray-600 cursor-pointer">
                  Debug: Estado del Dashboard
                </summary>
                <pre className="mt-2 text-xs text-gray-500 overflow-auto">
                  {JSON.stringify({
                    isApiHealthy,
                    exerciseSetsCount: exerciseSets.length,
                    currentPage,
                    totalPages,
                    totalItems,
                    filters,
                    stats
                  }, null, 2)}
                </pre>
              </details>
            </Card.Content>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;